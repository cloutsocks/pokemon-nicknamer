import '../style.scss';
import { dex } from './dex';

if (document.readyState !== "loading")
    init();
else
    document.addEventListener('DOMContentLoaded', init);


function init() {
    makeDex();
}

function makeDex() {
    const $pokedex = document.getElementById('pokedex');
    let fragment = makePokeGrid();
    $pokedex.appendChild(fragment);

    // add event listeners for every name
    let $blocks = $pokedex.querySelectorAll('.pokemon');
    $blocks.forEach($pokemon => {
        let $name = $pokemon.querySelector('.name');
        let $input = $name.nextElementSibling;

        $pokemon.addEventListener('click', (e) => {
            $name.classList.add('hidden');
            $input.classList.remove('hidden');
            $input.removeAttribute('tabindex');
            $input.focus();
        });

        $input.addEventListener('focus', (e) => {
            $input.select();
        });

        $input.addEventListener('blur', (e) => {
            if ($input.value.length == 0) {
                $name.classList.remove('hidden');
                $input.classList.add('hidden');
                $input.setAttribute('tabindex', -1);
            } else {
                $pokemon.classList.add('named');
            }
        });

        $input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                $input.blur();
            }
        });
    });
}

function makePokeGrid() {
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < dex.length; i++) {
        let block = makePokemonBlock(i+1, dex[i]);
        fragment.appendChild(block);
    }
    return fragment;
}

function makePokemonBlock(n, name) {
    const $pokemon = document.createElement('div');
    $pokemon.classList.add('pokemon');
    // left fill n with 0s
    let no = n.toString().padStart(3, '0');
    $pokemon.innerHTML = `<div class="pokemon-image">
    <img src="./img/pokemon/${name}.png" alt="{name}" loading="lazy">
</div>
<div class="no">#${no}</div>
<div class="name">${name}</div>
<input class="nickname hidden" tabindex="-1" type="text" placeholder="" maxlength="12">`;
    return $pokemon;
}