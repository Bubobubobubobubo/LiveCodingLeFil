const posters = {
    bleu: "https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/photos/affiches/poster3.png",
    jaune: "https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/photos/affiches/poster1.png",
    orange: "https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/photos/affiches/poster2.png",
}

const pictures = {
    remi: "https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/photos/ralt144mi.jpeg",
    elie: "https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/photos/elie.JPG",
    raph: "https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/photos/lezgo.png",
    baya: "https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/photos/azertype.png",
    leon: "https://raw.githubusercontent.com/Bubobubobubobubo/LiveCodingLeFil/main/public/photos/photo_leon.png",
}

const videos = {
    raph: "https://www.youtube.com/embed/MeEtO2Ti8_o",
    remi: "https://www.youtube.com/embed/61Q55nzFJq4",
    elie: "https://www.youtube.com/embed/3sWzO1mDk9Q",
    baya: "https://www.youtube.com/embed/RiGtfM0fmBE",
    leon: "https://peertube.swrs.net/videos/watch/ba4a1b7f-56db-45a9-9450-8a16185697c4",
}

const links = {
    raph: "https://raphaelforment.fr",
    remi: "https://rhoumi.github.io/",
    elie: "https://linktr.ee/julescipher",
    baya: "https://linktr.ee/azertype",
    leon: "https://leon196.github.io/",
}

const performers = [
    {
        pseudo: "BuboBubo",
        fullname: "Raphaël Forment",
        video: videos.raph, link: links.raph,
        description: "Raphaël (bubobubo) est un live-coder actif à Lyon et à Paris. Il est actif au sein du collectif TOPLAP et du mouvement Algorave depuis 2018. Raphaël s'intéresse à l'utilisation du live coding comme technique, instrument et art performatif par son travail de recherche, son enseignement ou ses collaborations avec le collectif parisien Cookie Collective ou avec les lyonnais du LocalHost.",
        url_portrait: pictures.raph,
        id: 1,
    },
    {
        pseudo: "Ralt144MI",
        fullname: "Rémi Georges",
        video: videos.remi, link: links.remi,
        description: "Ralt144MI est une bande sonore de souvenirs vidéos centrée sur un univers aquatique. C'est le résultat de la redécouverte d'un large stock de cassettes vidéos familiales de plongée sous-marine. Le son, codé en direct deviendra support des lectures de bandes, interagissant et évoluant avec elles.",
        url_portrait: pictures.remi,
        id: 2,
    },
    {
        pseudo: "Jules Cipher",
        fullname: "Elie Gavoty",
        video: videos.elie, link: links.elie,
        description: "Frappé assez récemment par la passion du livecoding, Elie Gavoty (Jules Cipher), développe une pratique tournée notamment vers les microrythmes et l'usage de spatialisation pour tenter d'intensifier l'immersion d'une dance music improvisée et atypique.",
        url_portrait: pictures.elie,
        id: 3,
    },
    {
        pseudo: "azertype", fullname: "Baya",
        video: videos.baya, link: links.baya,
        description: "azertype Half-blood wizard Hardware: XY OS: bipolar & dys Software: anticapitalism & intersectionnality & neurodiversity Powered by Cyberflemme",
        url_portrait: pictures.baya,
        id: 4,
    },
    {
        pseudo: "Léon Denise",
        fullname: "Léon Denise",
        video: videos.leon, link: links.leon,
        description: "Programmation d'effets visuels improvisées, entre sculptures fractales mathématiques, filtres d'images animés et distorsions de personnages 3D.",
        url_portrait: pictures.leon,
        id: 5,
    },
];

module.exports = {performers, posters};
