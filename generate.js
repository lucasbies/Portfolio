const Handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');

// ✅ Nettoyage et recréation du dossier dist
console.log('🧹 Nettoyage du dossier dist...');
fs.emptyDirSync('./dist');

// Enregistrer les partials
console.log('📦 Chargement des partials...');
const partials = ['header', 'footer'];
partials.forEach(partial => {
    const partialPath = path.join(__dirname, 'src/partials', `${partial}.hbs`);
    const partialContent = fs.readFileSync(partialPath, 'utf8');
    Handlebars.registerPartial(partial, partialContent);
});

// Charger le layout principal
const layoutPath = path.join(__dirname, 'src/layouts/main.hbs');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
const layoutTemplate = Handlebars.compile(layoutContent);

// Définir les pages avec leurs meta tags
const pages = [
    {
        template: 'index.hbs',
        output: 'index.html',
        meta: {
            title: 'Lucas Bieszczad | Développeur backend - Portfolio',
            description: 'Lucas Bieszczad, développeur backend en formation (BUT Informatique). Python, API, bases de données SQL, C++. Portfolio de projets.',
            url: 'https://lucasbies.github.io/Portfolio/',
            image: 'https://lucasbies.github.io/Portfolio/assets/og-image.webp',
            type: 'website'
        }
    },
    {
        template: 'about.hbs',
        output: 'about.html',
        meta: {
            title: 'À propos | Lucas Bieszczad - Développeur backend',
            description: 'Lucas Bieszczad, étudiant en BUT Informatique Graphique au Puy-en-Velay, orienté développement backend : Python, API, SQL et architecture logicielle.',
            url: 'https://lucasbies.github.io/Portfolio/about.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/og-image.webp',
            type: 'profile'
        }
    },
    {
        template: 'projets.hbs',
        output: 'projets.html',
        meta: {
            title: 'Projets | Lucas Bieszczad - Développeur backend',
            description: 'Projets de Lucas Bieszczad : synchronisation réseau multijoueur, générateur procédural, C++ orienté objet et architecture logicielle.',
            url: 'https://lucasbies.github.io/Portfolio/projets.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/og-image.webp',
            type: 'website'
        }
    },
    {
        template: 'TransMontagne.hbs',
        output: 'TransMontagne.html',
        meta: {
            title: 'Trans Montagne | Lucas Bieszczad - Développeur backend',
            description: 'Trans Montagne : jeu d’exploration narratif sur Unreal Engine 5 (Blueprint). IA modulaires, sauvegarde, checkpoints et menus. Équipe de 5, 6 mois.',
            url: 'https://lucasbies.github.io/Portfolio/TransMontagne.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/projects/TransMontagne/Blocking.webp',
            type: 'article'
        }
    },
    {
        template: 'solitaire.hbs',
        output: 'solitaire.html',
        meta: {
            title: 'Solitaire Console C++ | Lucas Bieszczad - Développeur backend',
            description: 'Solitaire Console C++ : jeu Klondike fonctionnel avec POO, gestion mémoire moderne et architecture modulaire. Projet académique 3 jours.',
            url: 'https://lucasbies.github.io/Portfolio/solitaire.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/projects/solitaire/thumbnail.webp',
            type: 'article'
        }
    },
    {
        template: 'OverRule.hbs',
        output: 'OverRule.html',
        meta: {
            title: 'Over Rule | Lucas Bieszczad - Développeur backend',
            description: 'Over Rule : jeu multijoueur 2D Unity avec Netcode for GameObjects. Synchronisation réseau, lobby system et mécaniques coopératives. Projet académique équipe 5.',
            url: 'https://lucasbies.github.io/Portfolio/OverRule.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/projects/OverRule/OverRule.webp',
            type: 'article'
        }
    },
    {
        template: 'contact.hbs',
        output: 'contact.html',
        meta: {
            title: 'Contact | Lucas Bieszczad - Développeur backend',
            description: 'Contactez Lucas Bieszczad pour une opportunité en développement backend (Python, API, SQL) ou une collaboration. Réponse sous 48h.',
            url: 'https://lucasbies.github.io/Portfolio/contact.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/og-image.webp',
            type: 'website'
        }
    },
    {
        template: 'DonjonProcedural.hbs',
        output: 'DonjonProcedural.html',
        meta: {
            title: 'Donjon Procedural | Lucas Bieszczad - Développeur backend',
            description: 'Donjon procédural généré avec Unity 6, mettant en œuvre des algorithmes de génération procédurale pour des environnements de jeu dynamiques.',
            url: 'https://lucasbies.github.io/Portfolio/DonjonProcedural.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/projects/DonjonProcedural/DonjonProcedural.webp',
            type: 'article'
        }
    }
];

// Générer chaque page
console.log('🔨 Génération des pages HTML...');
pages.forEach(page => {
    try {
        const pagePath = path.join(__dirname, 'src/views', page.template);
        const pageContent = fs.readFileSync(pagePath, 'utf8');
        const pageTemplate = Handlebars.compile(pageContent);
        
        const pageHtml = pageTemplate({
            meta: page.meta
        });
        
        const finalHtml = layoutTemplate({
            body: pageHtml,
            meta: page.meta,
            year: new Date().getFullYear()
        });
        
        const outputPath = path.join(__dirname, 'dist', page.output);
        fs.writeFileSync(outputPath, finalHtml);
        
        console.log(`   ✅ ${page.output} généré avec succès`);
    } catch (error) {
        console.error(`   ❌ Erreur lors de la génération de ${page.output}:`, error.message);
    }
});

// ✅ COPIE DES ASSETS (CSS, JS, images, fonts, etc.)
console.log('📂 Copie des assets...');
try {
    fs.copySync('./src/assets', './dist/assets');
    console.log('   ✅ Assets copiés avec succès');
} catch (error) {
    console.error('   ❌ Erreur lors de la copie des assets:', error.message);
}

console.log('\n🎉 Génération terminée !');
console.log('📁 Fichiers générés dans le dossier ./dist/');