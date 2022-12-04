import "../style.scss";
import { dex } from "./dex";
import html2canvas from "html2canvas";

if (document.readyState !== "loading") init();
else document.addEventListener("DOMContentLoaded", init);

let $pokedex;
let $exporter;
let $main;
let $canvas;

function init() {
    $pokedex = document.getElementById("pokedex");
    $exporter = document.getElementById("exporter");
    $main = document.getElementById("main");

    makeDex();

    // add event listener for share
    let $download = document.getElementById("btn_download");
    $download.addEventListener("click", (e) => {
        // apply styles
        $pokedex.classList.add("filtered");
        $pokedex.parentElement.style.width = getSquareWidth() + "px";

        html2canvas(document.querySelector("#pokedex").parentElement).then((canvas) => {
            $canvas = canvas;
            canvas.style.opacity = "0";
            canvas.style.transform = "scale(0)";
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

    $exporter.addEventListener("click", (e) => {
        $exporter.classList.add("hidden");
        $canvas.remove();
    });
}

function makeDex() {
    let fragment = makePokeGrid();
    $pokedex.appendChild(fragment);

    // add event listeners for every name
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
}

function makePokeGrid() {
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < dex.length; i++) {
        let block = makePokemonBlock(i + 1, dex[i]);
        fragment.appendChild(block);
    }
    return fragment;
}

function makePokemonBlock(n, name) {
    const $pokemon = document.createElement("div");
    $pokemon.classList.add("pokemon");

    $pokemon.dataset.no = n;
    $pokemon.dataset.name = name;
    // left fill n with 0s
    let no = n.toString().padStart(3, "0");

    let image = document.createElement("div");
    image.classList.add("pokemon-image");
    image.innerHTML = `<img src="./img/pokemon/${name}.png" alt="${name}" loading="lazy">`;
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
