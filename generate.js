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
            title: 'Lucas Bieszczad | Gameplay Programmer - Portfolio',
            description: 'Lucas Bieszczad | Gameplay Programmer étudiant spécialisé en systèmes de combat et AI sur Unreal Engine 5. Portfolio projets C++/Blueprint.',
            url: 'https://lucasbies.github.io/Portfolio/',
            image: 'https://lucasbies.github.io/Portfolio/assets/og-image.webp',
            type: 'website'
        }
    },
    {
        template: 'about.hbs',
        output: 'about.html',
        meta: {
            title: 'À propos | Lucas Bieszczad - Gameplay Programmer',
            description: 'Lucas Bieszczad, 18 ans, étudiant BUT Informatique Graphique au Puy-en-Velay. Spécialisé Unreal Engine 5, C++, systèmes de combat et AI.',
            url: 'https://lucasbies.github.io/Portfolio/about.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/og-image.webp',
            type: 'profile'
        }
    },
    {
        template: 'projets.hbs',
        output: 'projets.html',
        meta: {
            title: 'Projets | Lucas Bieszczad - Gameplay Programmer',
            description: 'Portfolio projets jeux vidéo : niveau Steampunk Unreal Engine 5, Solitaire C++, systèmes de combat et AI. Gameplay Programming.',
            url: 'https://lucasbies.github.io/Portfolio/projets.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/og-image.webp',
            type: 'website'
        }
    },
    {
        template: 'TransMontagne.hbs',
        output: 'TransMontagne.html',
        meta: {
            title: 'Projet Steampunk | Lucas Bieszczad - Gameplay Programmer',
            description: 'Projet Steampunk : niveau action/plateforme Unreal Engine 5 avec dash multi-directionnel, wall-running et AI ennemis. Équipe 5, 6 mois.',
            url: 'https://lucasbies.github.io/Portfolio/TransMontagne.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/Blocking.webp',
            type: 'article'
        }
    },
    {
        template: 'solitaire.hbs',
        output: 'solitaire.html',
        meta: {
            title: 'Solitaire Console C++ | Lucas Bieszczad - Gameplay Programmer',
            description: 'Solitaire Console C++ : jeu Klondike fonctionnel avec POO, gestion mémoire moderne et architecture modulaire. Projet académique 3 jours.',
            url: 'https://lucasbies.github.io/Portfolio/solitaire.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/Solitaire.webp',
            type: 'article'
        }
    },
    {
        template: 'OverRule.hbs',
        output: 'OverRule.html',
        meta: {
            title: 'Over Rule | Lucas Bieszczad - Gameplay Programmer',
            description: 'Over Rule : jeu multijoueur 2D Unity avec Netcode for GameObjects. Synchronisation réseau, lobby system et mécaniques coopératives. Projet académique équipe 5.',
            url: 'https://lucasbies.github.io/Portfolio/OverRule.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/OverRule.webp',
            type: 'article'
        }
    },
    {
        template: 'contact.hbs',
        output: 'contact.html',
        meta: {
            title: 'Contact | Lucas Bieszczad - Gameplay Programmer',
            description: 'Contactez Lucas Bieszczad pour un stage Gameplay Programmer (été 2026), projet C++/Unreal Engine ou collaboration. Réponse sous 48h.',
            url: 'https://lucasbies.github.io/Portfolio/contact.html',
            image: 'https://lucasbies.github.io/Portfolio/assets/og-image.webp',
            type: 'website'
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
            meta: page.meta
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