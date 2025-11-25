//-----------------------------------------------------
// DATOS (5 carros, 10 fotos cada uno)
//-----------------------------------------------------
const carros = [
    {id:1,fotos:Array.from({length:10},(_,i)=>`images/carro1-${i+1}.jpg`),reseña:{usuario:"José Pérez Pérez",estrellas:4.5,comentario:"Unos maquinas, al final me salió mas barato con ellos que de segunda mano"}},
    {id:2,fotos:Array.from({length:10},(_,i)=>`images/carro2-${i+1}.jpg`),reseña:{usuario:"María José Toro Fernandez",estrellas:5,comentario:"Todo perfecto, el coche llegó antes de lo esperado. Valentín e Iván fueron muy amables todo el tiempo."}},
    {id:3,fotos:Array.from({length:10},(_,i)=>`images/carro3-${i+1}.jpg`),reseña:{usuario:"Usuario Anonimo",estrellas:4,comentario:"Buen trabajo, Valentín fue eficiente"}},
    {id:4,fotos:Array.from({length:10},(_,i)=>`images/carro4-${i+1}.jpg`),reseña:{usuario:"Ana García Pernía",estrellas:5,comentario:"Fueron amables y llegó sano y salvo a casa, tuvimos un problema durante la inspección pero lo solucionaron asi que me quedo tranquila"}},
    {id:5,fotos:Array.from({length:10},(_,i)=>`images/carro5-${i+1}.jpg`),reseña:{usuario:"Luis",estrellas:4.5,comentario:"Muy bueno el chaval, y el coche también vaya, se nota que lo hacen con ganas"}}
];

const container = document.querySelector('.carousel-container');
let currentIndex = 0;
const currentPhotoIndex = carros.map(()=>0);

let autoplayInterval = null;
let manualTimeout = null;

//-----------------------------------------------------
// GENERAR CARROS
//-----------------------------------------------------
carros.forEach((carro, index) => {

    const div = document.createElement('div');
    div.classList.add('carousel-item');
    div.dataset.index = index;

    div.innerHTML = `
        <img src="${carro.fotos[0]}" alt="Imagen del carro ${carro.id}">
        <div class="carousel-photo-nav">
            <button class="prev-photo" aria-label="Foto anterior">&#10094;</button>
            <button class="next-photo" aria-label="Siguiente foto">&#10095;</button>
        </div>
        <div class="carousel-dots" aria-hidden="true"></div>
        <h4>${carro.reseña.usuario}</h4>
        <div class="stars">${generarEstrellas(carro.reseña.estrellas)}</div>
        <p class="carousel-resena">${carro.reseña.comentario}</p>
    `;

    container.appendChild(div);

    // Dots
    const dotsContainer = div.querySelector(".carousel-dots");
    carro.fotos.forEach((_,i)=>{
        const dot = document.createElement("div");
        if(i===0) dot.classList.add("active");
        dotsContainer.appendChild(dot);
    });

    // Botones internos: cambiar foto
    div.querySelector('.prev-photo').addEventListener('click', e => {
        e.stopPropagation();
        changePhoto(index, -1);
        startManualMode();
    });
    div.querySelector('.next-photo').addEventListener('click', e => {
        e.stopPropagation();
        changePhoto(index, 1);
        startManualMode();
    });

    // Click en el carro para centrarlo
    div.addEventListener('click', () => {
        if(index !== currentIndex){
            currentIndex = index;
            updateSlider();
            startManualMode();
        }
    });
});

//-----------------------------------------------------
// ---- MICROSECCIONES EXPANDIBLES (Sección 2)
//-----------------------------------------------------
(function enableMicrosections(){
    const sections = document.querySelectorAll('.microsection');
    sections.forEach(sec => {
        let content = sec.querySelector('.content');
        if(!content){
            const paragraphs = Array.from(sec.querySelectorAll('p'));
            content = document.createElement('div');
            content.className = 'content';
            paragraphs.forEach(p => content.appendChild(p));
            const ul = sec.querySelector('ul');
            if(ul) content.appendChild(ul);
            sec.appendChild(content);
        }
        sec.setAttribute('role', 'button');
        sec.setAttribute('tabindex', '0');
        sec.setAttribute('aria-expanded', 'false');

        const toggle = () => {
            const expanded = sec.classList.toggle('expanded');
            sec.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        };

        sec.addEventListener('click', (e) => {
            if (e.target.closest('.prev-photo') || e.target.closest('.next-photo')) return;
            toggle();
        });
        sec.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' || e.key === ' '){
                e.preventDefault();
                toggle();
            }
        });
    });
})();

//-----------------------------------------------------
// Obtener items ya creados
//-----------------------------------------------------
const items = Array.from(container.children);

//-----------------------------------------------------
// CAMBIAR FOTO
//-----------------------------------------------------
function changePhoto(carroIndex, dir){
    const total = carros[carroIndex].fotos.length;
    currentPhotoIndex[carroIndex] =
        (currentPhotoIndex[carroIndex] + dir + total) % total;

    const item = items[carroIndex];
    item.querySelector("img").src =
        carros[carroIndex].fotos[currentPhotoIndex[carroIndex]];

    const dots = item.querySelectorAll(".carousel-dots div");
    dots.forEach((d,i)=>d.classList.toggle("active",
        i === currentPhotoIndex[carroIndex]));
}

//-----------------------------------------------------
// CENTRAR CARRUSEL
//-----------------------------------------------------
function updateSlider(){
    const offsetX = window.innerWidth > 1200 ? 200 : 130;
    const scale = window.innerWidth > 1200 ? 0.85 : 0.8;

    items.forEach(el=>{
        el.style.opacity="0";
        el.style.transform="translate(-50%,-50%) scale(0.7)";
        el.style.zIndex="0";
    });

    const prev = (currentIndex - 1 + items.length) % items.length;
    const next = (currentIndex + 1) % items.length;

    items[currentIndex].style.opacity="1";
    items[currentIndex].style.transform="translate(-50%,-50%) scale(1)";
    items[currentIndex].style.zIndex="3";

    items[prev].style.opacity="0.6";
    items[prev].style.transform=`translate(calc(-50% - ${offsetX}px), -50%) scale(${scale})`;
    items[prev].style.zIndex="2";

    items[next].style.opacity="0.6";
    items[next].style.transform=`translate(calc(-50% + ${offsetX}px), -50%) scale(${scale})`;
    items[next].style.zIndex="2";
}

//-----------------------------------------------------
// AUTOPLAY
//-----------------------------------------------------
function startAutoplay(){
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(()=>{
        currentIndex = (currentIndex + 1) % items.length;
        updateSlider();
    },5000);
}

//-----------------------------------------------------
// MODO MANUAL
//-----------------------------------------------------
function startManualMode(){
    clearInterval(autoplayInterval);
    clearTimeout(manualTimeout);

    manualTimeout = setTimeout(()=>{
        startAutoplay();
    },10000);
}

//-----------------------------------------------------
function generarEstrellas(n){
    const full = Math.floor(n);
    const half = n % 1 >= .5;
    const empty = 5 - full - (half?1:0);
    return "★".repeat(full) + (half?"☆":"") + "☆".repeat(empty);
}

// inicial
updateSlider();
startAutoplay();
