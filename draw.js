function melangerTableau(tableau) {
    for (let i = tableau.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
    }
}

function attribuerMembres(participants) {
    melangerTableau(participants);

    const attributions = {};

    for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        const membreDuGroupe = participants[(i + 1) % participants.length];
        attributions[participant] = membreDuGroupe;
    }

    return attributions;
}

module.exports = { attribuerMembres };