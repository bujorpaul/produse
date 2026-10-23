const URL_API = 'https://dummyjson.com/products';

const listaProduse = document.getElementById('lista-produse');
const stareIncarcare = document.getElementById('stare-incarcare');
const stareEroare = document.getElementById('stare-eroare');
const stareGoala = document.getElementById('stare-goala');

const formular = document.getElementById('formular-produs');
const eroareFormular = document.getElementById('eroare-formular');

function actualizeazaStareGoala() {
    if (listaProduse.children.length === 0) {
        stareGoala.classList.remove('ascuns');
    } else {
        stareGoala.classList.add('ascuns');
    }
}
function creeazaElementProdus(produs) {
    const li = document.createElement('li');
    li.className = 'element-produs';
    li.dataset.id = produs.id;

    const titlu = document.createElement('h3');
    titlu.textContent = produs.title;

    const pret = document.createElement('p');
    pret.className = 'pret-produs';
    pret.textContent = 'Preț: ' + produs.price + ' USD';

    const descriere = document.createElement('p');
    descriere.textContent = produs.description;

    const butonStergere = document.createElement('button');
    butonStergere.textContent = 'Șterge';
    butonStergere.className = 'buton-stergere';

    li.appendChild(titlu);
    li.appendChild(pret);
    li.appendChild(descriere);
    li.appendChild(butonStergere);

    return li;
}

async function incarcaProduse() {
    stareIncarcare.classList.remove('ascuns');
    stareEroare.classList.add('ascuns');
    stareGoala.classList.add('ascuns');

    try {
        const raspuns = await fetch(URL_API + '?limit=5');
        //const raspuns = await fetch(URL_API + '/search?q=produsinexistent123');

        if (!raspuns.ok) {
            throw new Error('Eroare la încărcare. Cod status: ' + raspuns.status);
        }

        const date = await raspuns.json();
        const produse = date.products;
        
        stareIncarcare.classList.add('ascuns');

        if (produse.length === 0) {
            stareGoala.classList.remove('ascuns');
        } else {
            for (let i = 0; i < produse.length; i++) {
                const element = creeazaElementProdus(produse[i]);
                listaProduse.appendChild(element);
            }
        }
    } catch (eroare) {
        stareIncarcare.classList.add('ascuns');
        stareEroare.textContent = 'Nu am putut încărca lista de produse. Verifică conexiunea.';
        stareEroare.classList.remove('ascuns');
    }
}

async function adaugaProdus(eveniment) {
    eveniment.preventDefault();
    eroareFormular.classList.add('ascuns');

    const dateFormular = new FormData(formular);
    const obiectProdus = {
        title: dateFormular.get('title'),
        price: Number(dateFormular.get('price')),
        description: dateFormular.get('description')
    };

    try {
        const raspuns = await fetch(URL_API + '/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obiectProdus)
        });

        if (raspuns.status >= 400 && raspuns.status < 500) {
            const detaliiEroare = await raspuns.json();
            eroareFormular.textContent = detaliiEroare.message || 'Datele introduse sunt invalide (Eroare ' + raspuns.status + ').';
            eroareFormular.classList.remove('ascuns');
            return;
        }

        if (!raspuns.ok) {
            throw new Error('Eroare server: ' + raspuns.status);
        }

        if (raspuns.status === 201 || raspuns.status === 200) {
            const produsNou = await raspuns.json();
            const elementNou = creeazaElementProdus(produsNou);
            listaProduse.prepend(elementNou);
            formular.reset();
            actualizeazaStareGoala();
        }
    } catch (eroare) {
        eroareFormular.textContent = 'Eroare de rețea. Nu s-a putut comunica cu serverul.';
        eroareFormular.classList.remove('ascuns');
    }
}

async function gestioneazaClickLista(eveniment) {
    if (eveniment.target.classList.contains('buton-stergere')) {
        const elementLi = eveniment.target.closest('li');
        const idProdus = elementLi.dataset.id;

        try {
            if (Number(idProdus) <= 194) {
                const raspuns = await fetch(URL_API + '/' + idProdus, {
                    method: 'DELETE'
                });

                if (!raspuns.ok) {
                    throw new Error('Nu s-a putut șterge produsul.');
                }
            }

            elementLi.remove();
            actualizeazaStareGoala();
        } catch (eroare) {
            alert('Eroare la ștergerea produsului.');
        }
    }
}

document.addEventListener('DOMContentLoaded', incarcaProduse);
formular.addEventListener('submit', adaugaProdus);
listaProduse.addEventListener('click', gestioneazaClickLista);