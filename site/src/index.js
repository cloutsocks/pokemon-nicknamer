import "../style.scss";
import { dex } from "./dex";
// import { pokeball } from "./pokeball";
import html2canvas from "html2canvas";

const teamPlaceholder = "enter your team name";

let $pokedex;
let $exporter;
let $main;
let $canvas;
let $teamBlock;
let $typePicker;
let $floatingUi;

let types = {
    'ice': '#9dd1f2',
    'dragon': '#646eab',
    'water': '#78a4bf',
    'fire': '#e88158',
    'electric': '#f2cb6f',
    'fairy': '#f0a1c1',
    'dark': '#6b6b6b',
    'grass': '#7fbf78',
    'normal': '#838383',
    'ground': '#9c6e5a',
    'psychic': '#bd8cbf',
}



if (document.readyState !== "loading") init();
else document.addEventListener("DOMContentLoaded", init);


function init() {
    $pokedex = document.getElementById("pokedex");
    $exporter = document.getElementById("exporter");
    $main = document.getElementById("main");
    $floatingUi = document.getElementById("floating_ui");

    makeDex();
    makeTypePicker();

    // add event listener for share
    let $download = document.getElementById("btn_download");
    $download.addEventListener("click", (e) => {

        $floatingUi.classList.add("hidden");

        // apply styles
        $pokedex.classList.add("filtered");
        $pokedex.parentElement.style.width = getSquareWidth() + "px";

        let $teamName;
        if (!localStorage['team_name']) {
            $teamName = $teamBlock.querySelector(".name");
            $teamName.textContent = "";
        }
        html2canvas(document.querySelector("#pokedex").parentElement).then((canvas) => {
            $canvas = canvas;
            canvas.style.opacity = "0";
            canvas.style.transform = "scale(0)";
            canvas.style.width = "";
            canvas.style.height = "";

            $exporter.appendChild(canvas);

            $exporter.classList.remove("hidden");

            // animate
            setTimeout(() => {
                canvas.style.opacity = "1";
                canvas.style.transform = "scale(1)";
            }, 10);
        });

        // remove styles
        $pokedex.classList.remove("filtered");
        $pokedex.parentElement.style.width = "auto";
        if (!localStorage['team_name']) {
            $teamName.textContent = teamPlaceholder;
        }
    });

    let $filter = document.getElementById("btn_filter");
    $filter.addEventListener("click", (e) => {
        $pokedex.classList.toggle("filtered");

        if ($pokedex.classList.contains("filtered")) {
            $pokedex.style.width = getSquareWidth() + "px";
        } else {
            $pokedex.style.width = "auto";
        }
    });

    let $save = document.getElementById("btn_save");
    $save.addEventListener("click", (e) => {
        e.stopPropagation();
        let image = new Image();
        image.src = $canvas.toDataURL("image/png");

        let anchor = document.createElement("a");
        anchor.setAttribute("href", image.src);
        anchor.setAttribute("download", "nicknames.png");
        anchor.click();
    });

    $exporter.addEventListener("click", (e) => {
        $floatingUi.classList.remove("hidden");
        $exporter.classList.add("hidden");
        $canvas.remove();
    });
}

function makeTypePicker() {
    $typePicker = document.querySelector(".type-picker");

    let $types = document.createElement("div");
    $types.classList.add("types");

    for (let type in types) {
        let $type = document.createElement("div");
        $type.classList.add("type");
        $type.dataset.type = type;
        $type.style.backgroundColor = types[type];
        $types.appendChild($type);
    }

    if (!localStorage['team_type']) {
        // random team type
        localStorage['team_type'] = Object.keys(types)[Math.floor(Math.random() * Object.keys(types).length)];
    }
    $types.querySelector(`[data-type="${localStorage['team_type']}"]`).classList.add("selected");
    $teamBlock.style.backgroundColor = types[localStorage['team_type']];
    if(['ice', 'electric', 'fairy'].includes(localStorage['team_type'])) {
        $teamBlock.style.setProperty("--text-color", "black");
    } else {
        $teamBlock.style.setProperty("--text-color", "white");
    }

    $types.addEventListener("click", (e) => {
        if (e.target.classList.contains("type")) {
            $types.querySelector(".selected").classList.remove("selected");
            e.target.classList.add("selected");
            localStorage['team_type'] = e.target.dataset.type;
            $teamBlock.style.backgroundColor = types[localStorage['team_type']];
            if(['ice', 'electric', 'fairy'].includes(localStorage['team_type'])) {
                $teamBlock.style.setProperty("--text-color", "black");
            } else {
                $teamBlock.style.setProperty("--text-color", "white");
            }
        }
    });

    $typePicker.appendChild($types);
}

function makeDex() {
    let fragment = makePokeGrid();
    $pokedex.appendChild(fragment);

    let $blocks = $pokedex.querySelectorAll(".pokemon");
    $blocks.forEach(($pokemon) => {
        let $name = $pokemon.querySelector(".name");
        let $input = $name.nextElementSibling;

        $pokemon.addEventListener("click", (e) => {
            $name.classList.add("hidden");
            $input.classList.remove("hidden");
            $input.removeAttribute("tabindex");
            $input.focus();
        });

        $input.addEventListener("focus", (e) => {
            $input.select();
        });

        $input.addEventListener("blur", (e) => {
            if ($input.value.length > 0) {
                localStorage[$pokemon.dataset.name] = $input.value;
                $pokemon.classList.add("named");
            } else {
                delete localStorage[$pokemon.dataset.name];
                $pokemon.classList.remove("named");
                $name.classList.remove("hidden");
                $input.classList.add("hidden");
                $input.setAttribute("tabindex", -1);
            }
        });

        $input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                $input.blur();
            }
        });
    });

    // add event listeners for team block
    let $name = $teamBlock.querySelector(".name");
    let $input = $name.nextElementSibling;

    $teamBlock.addEventListener("click", (e) => {
        $name.classList.add("hidden");
        $input.classList.remove("hidden");
        $input.removeAttribute("tabindex");
        $input.focus();
    });

    $input.addEventListener("focus", (e) => {
        $input.select();
    });

    $input.addEventListener("blur", (e) => {
        if ($input.value.length > 0) {
            $name.textContent = localStorage['team_name'] = $input.value;
        } else {
            $name.textContent = teamPlaceholder;
            delete localStorage['team_name'];
        }

        $name.classList.remove("hidden");
        $input.classList.add("hidden");
        $input.setAttribute("tabindex", -1);
    });

    $input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            $input.blur();
        }
    });



}

function makePokeGrid() {
    let fragment = document.createDocumentFragment();

    $teamBlock = makeTeamBlock("team")

    fragment.appendChild($teamBlock);

    for (let i = 0; i < dex.length; i++) {
        let block = makePokemonBlock(i + 1, dex[i]);
        fragment.appendChild(block);
    }

    return fragment;
}

function makePokemonBlock(n, name) {
    const $pokemon = document.createElement("div");
    $pokemon.classList.add("block");
    $pokemon.classList.add("pokemon");

    $pokemon.dataset.no = n;
    $pokemon.dataset.name = name;
    // left fill n with 0s
    let no = n.toString().padStart(3, "0");

    let image = document.createElement("div");
    image.classList.add("pokemon-image");
    image.innerHTML = `<img src="./img/pokemon/${name}.png" alt="${name}">`;
    $pokemon.appendChild(image);

    let noDiv = document.createElement("div");
    noDiv.classList.add("no");
    noDiv.textContent = `#${no}`;
    $pokemon.appendChild(noDiv);

    let nameDiv = document.createElement("div");
    nameDiv.classList.add("name");
    nameDiv.textContent = name;
    $pokemon.appendChild(nameDiv);

    let input = document.createElement("input");
    input.classList.add("nickname");
    input.setAttribute("type", "text");
    input.setAttribute("maxlength", 12);
    $pokemon.appendChild(input);

    if (localStorage[name]) {
        $pokemon.classList.add("named");
        nameDiv.classList.add("hidden");
        input.value = localStorage[name];
    } else {
        input.classList.add("hidden");
        input.setAttribute("tabindex", -1);
    }

    return $pokemon;
}

function makeTeamBlock(id) {
    let $block = document.createElement("div");
    
    $block.id = id;
    $block.classList.add("block");
    $block.classList.add("team-block");

    let $content = document.createElement("div");
    $content.classList.add("content");  

    let $name = document.createElement("div");
    $name.classList.add("name");
    $name.textContent = teamPlaceholder;
    $content.appendChild($name);

    let $input = document.createElement("input");
    $input.classList.add("nickname");
    $input.setAttribute("type", "text");
    $input.classList.add("hidden");
    $input.setAttribute("tabindex", -1);
    $content.appendChild($input);

    let $madewith = document.createElement("div");
    $madewith.classList.add("madewith");
    $madewith.innerHTML = `made with <span class="url">nicknames.please.rest</span>`;
    $content.appendChild($madewith);

    if (localStorage['team_name']) {
        $name.textContent = $input.value = localStorage['team_name'];
    } else {

    }

    $block.appendChild($content);


    // let $pokeball = document.createElement("div");
    // $pokeball.classList.add("pokeball");
    // $pokeball.innerHTML = pokeball;
    // $block.appendChild($pokeball);

    return $block;
}

function getSquareWidth() {
    let n = $pokedex.querySelectorAll(".named").length;

    let a = Math.ceil(Math.sqrt(n));
    let b = Math.ceil(n / a);
    let columns = Math.max(a, b);

    let gapWidth = 8;
    let blockWidth = 145.5;
    let calculatedWidth = blockWidth * columns + gapWidth * (columns - 1) + 16;

    // console.log(`n: ${n}, a: ${a}, b: ${b}, columns: ${columns}, calculatedWidth: ${calculatedWidth}`);

    return calculatedWidth;
}
