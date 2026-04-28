const BIBLIOTECA_EJERCICIOS = {
    "Pecho": ["Press de Banca", "Aperturas con Mancuernas", "Flexiones de Brazo"],
    "Espalda": ["Dominadas", "Remo con Barra", "Jalón al Pecho", "Peso Muerto"],
    "Piernas": ["Sentadillas", "Prensa de Piernas", "Zancadas", "Extensión de Cuádriceps"],
    "Hombros": ["Press Militar", "Elevaciones Laterales", "Pájaros"],
    "Brazos": ["Curl de Bíceps", "Extensión de Tríceps", "Martillos"],
    "Core": ["Plancha Abdominal", "Elevación de Piernas", "Rueda Abdominal"]
};

function generateElitePlan() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const days = parseInt(document.getElementById('days').value);
    const time = parseInt(document.getElementById('sessionTime').value);
    const goal = document.getElementById('goal').value;
    const foods = document.getElementById('favFoods').value.split(',').map(f => f.trim());

    if (!weight || !height || foods.length < 1) return alert("Por favor, completa todos los campos.");

    // IMC
    const imc = (weight / ((height/100) ** 2)).toFixed(1);
    document.getElementById('imcDisplay').innerText = `ÍNDICE DE MASA CORPORAL: ${imc}`;

    // MACRONUTRIENTES (Sin abreviaciones)
    const kcal = goal === 'ganar' ? weight * 35 : goal === 'perder' ? weight * 25 : weight * 30;
    const proteinas = Math.round(weight * 2);
    const grasas = Math.round(weight * 0.8);
    const carbohidratos = Math.round((kcal - (proteinas * 4) - (grasas * 9)) / 4);

    document.getElementById('macroBoard').innerHTML = `
        <div class="macro-box">CALORÍAS<span>${Math.round(kcal)}</span></div>
        <div class="macro-box">PROTEÍNAS<span>${proteinas}g</span></div>
        <div class="macro-box">CARBOHIDRATOS<span>${carbohidratos}g</span></div>
        <div class="macro-box">GRASAS<span>${grasas}g</span></div>
    `;

    renderRoutine(days, time);
    renderSevenDayDiet(proteinas, carbohidratos, grasas, foods);
    document.getElementById('result').classList.remove('hidden');
}

function renderRoutine(days, time) {
    const container = document.getElementById('routineContent');
    container.innerHTML = "<h2>Plan de Entrenamiento</h2>";
    
    // Lógica de intensidad: a menos días, más ejercicios por sesión para compensar
    const numEjercicios = time < 45 ? 4 : time < 90 ? 6 : 8;
    const split = getSplit(days);

    split.forEach((enfoque, i) => {
        let ejerciciosDelDia = [];
        if (days === 1) {
            // Un solo día: cuerpo completo con muchos ejercicios
            Object.values(BIBLIOTECA_EJERCICIOS).forEach(cat => ejerciciosDelDia.push(cat[0]));
            if (numEjercicios > 6) ejerciciosDelDia.push(BIBLIOTECA_EJERCICIOS["Piernas"][1], BIBLIOTECA_EJERCICIOS["Espalda"][1]);
        } else {
            // Segmentado
            const categorias = enfoque.split(' y ');
            categorias.forEach(cat => {
                ejerciciosDelDia = ejerciciosDelDia.concat(BIBLIOTECA_EJERCICIOS[cat] || []);
            });
        }

        const seleccion = ejerciciosDelDia.slice(0, numEjercicios);

        container.innerHTML += `
            <div class="day-card">
                <h3>DÍA ${i+1}: ${enfoque.toUpperCase()} (${time} min)</h3>
                <ul>
                    ${seleccion.map(ex => `<li>${ex} - 3 Series de 10-12 repeticiones</li>`).join('')}
                </ul>
            </div>
        `;
    });
}

function getSplit(days) {
    const modelos = {
        1: ["Cuerpo Completo"],
        2: ["Tren Superior", "Tren Inferior"],
        3: ["Pecho y Brazos", "Espalda y Core", "Piernas y Hombros"],
        4: ["Pecho", "Espalda", "Piernas", "Hombros y Brazos"],
        5: ["Pecho", "Espalda", "Piernas", "Hombros", "Brazos y Core"],
        6: ["Pecho", "Espalda", "Piernas", "Hombros", "Brazos", "Core"],
        7: ["Pecho", "Espalda", "Piernas", "Hombros", "Brazos", "Core", "Movilidad"]
    };
    return modelos[days] || modelos[3];
}

function renderSevenDayDiet(p, c, g, foods) {
    const container = document.getElementById('dietContent');
    container.innerHTML = "<h2>Dieta Variada (7 Días)</h2>";
    
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    
    diasSemana.forEach((dia, i) => {
        const alimentoPrincipal = foods[i % foods.length];
        const carbohidratoBase = i % 2 === 0 ? "Arroz Integral" : "Papa Cocida";
        
        container.innerHTML += `
            <div class="day-card">
                <h3>${dia}</h3>
                <p><strong>Desayuno:</strong> Tortilla de 3 huevos con espinaca y una porción de fruta.</p>
                <p><strong>Almuerzo:</strong> ${Math.round(p/3 * 4)}g de ${alimentoPrincipal} con ${Math.round(c/3 * 2)}g de ${carbohidratoBase}.</p>
                <p><strong>Cena:</strong> ${Math.round(p/4 * 4)}g de ${alimentoPrincipal} con ensalada verde y aceite de oliva.</p>
                <small>Ajuste de grasas diario: ${g} gramos totales.</small>
            </div>
        `;
    });
}

function showTab(tab) {
    document.getElementById('routineContent').classList.toggle('hidden', tab !== 'routine');
    document.getElementById('dietContent').classList.toggle('hidden', tab !== 'diet');
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(tab === 'routine' ? 'entrenamiento' : 'nutrición'));
    });
}