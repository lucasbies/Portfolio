const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Enregistrer les partials
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
            url: 'https://ton-site.com/',
            image: 'https://ton-site.com/assets/og-image.webp',
            type: 'website'
        }
    },
    {
        template: 'about.hbs',
        output: 'about.html',
        meta: {
            title: 'À propos | Lucas Bieszczad - Gameplay Programmer',
            description: 'Lucas Bieszczad, 18 ans, étudiant BUT Informatique Graphique au Puy-en-Velay. Spécialisé Unreal Engine 5, C++, systèmes de combat et AI.',
            url: 'https://ton-site.com/about.html',
            image: 'https://ton-site.com/assets/og-image.webp',
            type: 'profile'
        }
    },
    {
        template: 'projets.hbs',
        output: 'projets.html',
        meta: {
            title: 'Projets | Lucas Bieszczad - Gameplay Programmer',
            description: 'Portfolio projets jeux vidéo : niveau Steampunk Unreal Engine 5, Solitaire C++, systèmes de combat et AI. Gameplay Programming.',
            url: 'https://ton-site.com/projets.html',
            image: 'https://ton-site.com/assets/og-image.webp',
            type: 'website'
        }
    },/*
    {
        template: 'steampunk.hbs',
        output: 'steampunk.html',
        meta: {
            title: 'Projet Steampunk | Lucas Bieszczad - Gameplay Programmer',
            description: 'Projet Steampunk : niveau action/plateforme Unreal Engine 5 avec dash multi-directionnel, wall-running et AI ennemis. Équipe 5, 6 mois.',
            url: 'https://ton-site.com/steampunk.html',
            image: 'https://ton-site.com/assets/Blocking.webp',
            type: 'article'
        }
    },*/
    {
        template: 'Solitaire.hbs',
        output: 'Solitaire.html',
        meta: {
            title: 'Solitaire Console C++ | Lucas Bieszczad - Gameplay Programmer',
            description: 'Solitaire Console C++ : jeu Klondike fonctionnel avec POO, gestion mémoire moderne et architecture modulaire. Projet académique 3 jours.',
            url: 'https://ton-site.com/Solitaire.html',
            image: 'https://ton-site.com/assets/Solitaire.webp',
            type: 'article'
        }
    },
    {
        template: 'contact.hbs',
        output: 'contact.html',
        meta: {
            title: 'Contact | Lucas Bieszczad - Gameplay Programmer',
            description: 'Contactez Lucas Bieszczad pour un stage Gameplay Programmer (été 2026), projet C++/Unreal Engine ou collaboration. Réponse sous 48h.',
            url: 'https://ton-site.com/contact.html',
            image: 'https://ton-site.com/assets/og-image.webp',
            type: 'website'
        }
    }
];

// Générer chaque page
pages.forEach(page => {
    try {
        // Charger le contenu de la page
        const pagePath = path.join(__dirname, 'src/views', page.template);
        const pageContent = fs.readFileSync(pagePath, 'utf8');
        const pageTemplate = Handlebars.compile(pageContent);
        
        // Compiler la page avec ses données
        const pageHtml = pageTemplate({});
        
        // Injecter dans le layout avec meta tags
        const finalHtml = layoutTemplate({
            body: pageHtml,
            meta: page.meta
        });
        
        // Écrire le fichier final
        const outputPath = path.join(__dirname, 'dist', page.output);
        fs.writeFileSync(outputPath, finalHtml);
        
        console.log(`✅ ${page.output} généré avec succès`);
    } catch (error) {
        console.error(`❌ Erreur lors de la génération de ${page.output}:`, error);
    }
});

console.log('\n🎉 Génération terminée !');