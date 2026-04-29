const BIBLIOTECA_EJERCICIOS = {
    "Pecho": ["Press de Banca", "Press Inclinado con Mancuernas", "Cruces en Polea"],
    "Espalda": ["Dominadas", "Remo con Barra", "Jalón al Pecho", "Peso Muerto Rumano"],
    "Piernas": ["Sentadillas", "Prensa", "Zancadas", "Extensión de Cuádriceps", "Curl Femoral"],
    "Hombros": ["Press Militar", "Elevaciones Laterales", "Pájaros"],
    "Brazos": ["Curl de Bíceps", "Press Francés", "Martillos", "Extensiones en Polea"],
    "Core": ["Plancha", "Rueda Abdominal", "Elevación de Piernas"]
};

function generateElitePlan() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const days = parseInt(document.getElementById('days').value);
    const time = parseInt(document.getElementById('sessionTime').value);
    const intensity = document.getElementById('intensityType').value;
    const goal = document.getElementById('goal').value;
    const foodsInput = document.getElementById('favFoods').value;

    if (!weight || !height || isNaN(days)) return alert("Por favor ingresa datos válidos.");

    // IMC
    const imc = (weight / ((height/100) ** 2)).toFixed(1);
    document.getElementById('imcDisplay').innerText = `PERFIL BIOMÉTRICO: IMC ${imc}`;

    // Macros
    const kcal = goal === 'ganar' ? weight * 36 : goal === 'perder' ? weight * 26 : weight * 31;
    const p = Math.round(weight * 2.2);
    const g = Math.round(weight * 0.9);
    const c = Math.round((kcal - (p * 4) - (g * 9)) / 4);

    document.getElementById('macroBoard').innerHTML = `
        <div class="macro-box">CALORÍAS<span>${Math.round(kcal)}</span></div>
        <div class="macro-box">PROTEÍNAS<span>${p}g</span></div>
        <div class="macro-box">CARBOHIDRATOS<span>${c}g</span></div>
        <div class="macro-box">GRASAS<span>${g}g</span></div>
    `;

    renderCorrectedRoutine(days, time, intensity, goal);
    renderDetailedDiet(p, c, g, foodsInput);
    document.getElementById('result').classList.remove('hidden');
}

function renderCorrectedRoutine(days, time, intensity, goal) {
    const container = document.getElementById('routineContent');
    container.innerHTML = "<h2>Plan de Entrenamiento Corregido</h2>";
    
    // Ajuste de volumen por sesión
    let numEjercicios = Math.floor(time / 10); 
    numEjercicios = Math.max(4, Math.min(numEjercicios, 12));

    const split = getCorrectedSplit(days);

    split.forEach((enfoque, i) => {
        let pool = [];
        // CORRECCIÓN: Si el enfoque es "Cuerpo Completo", unificamos todas las categorías
        if (enfoque === "Cuerpo Completo") {
            Object.values(BIBLIOTECA_EJERCICIOS).forEach(cat => pool = pool.concat(cat));
        } else {
            const categorias = enfoque.split(' y ');
            categorias.forEach(cat => pool = pool.concat(BIBLIOTECA_EJERCICIOS[cat] || []));
        }

        // Selección aleatoria sin repetición
        const seleccion = pool.sort(() => 0.5 - Math.random()).slice(0, numEjercicios);

        container.innerHTML += `
            <div class="day-card">
                <h3>DÍA ${i+1}: ${enfoque.toUpperCase()}</h3>
                <p>Duración estimada: ${time} min | Intensidad: ${intensity === 'fallo' ? 'HIT' : 'Rango'}</p>
                <ul>
                    ${seleccion.map(ex => {
                        const prescrip = intensity === 'fallo' ? "2 Series al Fallo" : `3 Series de ${goal === 'fuerza' ? '5' : '10'} Reps`;
                        return `<li><strong>${ex}</strong>: ${prescrip}</li>`;
                    }).join('')}
                </ul>
            </div>
        `;
    });
}

function getCorrectedSplit(days) {
    // CORRECCIÓN CRÍTICA: Definición de rutinas para evitar vacíos
    if (days === 1) return ["Cuerpo Completo"];
    if (days === 2) return ["Tren Superior", "Tren Inferior"];
    if (days === 3) return ["Cuerpo Completo", "Cuerpo Completo", "Cuerpo Completo"]; // Frecuencia 3 efectiva
    
    const splits = {
        4: ["Pecho y Tríceps", "Espalda y Bíceps", "Piernas", "Hombros y Core"],
        5: ["Pecho", "Espalda", "Piernas", "Hombros", "Brazos"],
        6: ["Pecho y Espalda", "Piernas", "Hombros y Brazos", "Pecho y Espalda", "Piernas", "Hombros y Brazos"],
        7: ["Pecho", "Espalda", "Piernas", "Hombros", "Brazos", "Core", "Cardio Activo"]
    };
    return splits[days] || splits[4];
}

function renderDetailedDiet(p, c, g, input) {
    const container = document.getElementById('dietContent');
    container.innerHTML = "<h2>Nutrición Semanal Completa (4 Comidas)</h2>";
    
    const foodList = input ? input.split(',').map(f => f.trim()) : ["Pollo", "Huevos", "Pescado", "Ternera Magra", "Lentejas"];
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    dias.forEach((dia, i) => {
        const prote = foodList[i % foodList.length];
        container.innerHTML += `
            <div class="day-card">
                <h3>${dia.toUpperCase()}</h3>
                <p><strong>Desayuno:</strong> Huevos revueltos con avena y fruta.</p>
                <p><strong>Snack:</strong> Yogurt griego con 15g de nueces.</p>
                <p><strong>Almuerzo:</strong> ${Math.round(p/2.5 * 4)}g de ${prote} + Arroz y ensalada.</p>
                <p><strong>Cena:</strong> ${Math.round(p/3 * 4)}g de ${prote} + Vegetales al vapor y aguacate.</p>
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
