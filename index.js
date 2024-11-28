function getFirstSundayOfNovemberAt2AM(year) {
    if (typeof year !== "number" || year < 1) {
        throw new Error("Please provide a valid year as a number greater than 0.");
    }

    let date = new Date(year, 10, 1); // Start from November 1st (month 10)

    while (date.getDay() !== 0) { // Adjust to the first Sunday
        date.setDate(date.getDate() + 1);
    }

    date.setHours(2, 0, 0, 0); // Set time to 2:00 AM
    return date;
}

// Example usage
console.log(getFirstSundayOfNovemberAt2AM(2024));

function getSecondSundayOfMarchAt2AM(year) {
    if (typeof year !== "number" || year < 1) {
        throw new Error("Please provide a valid year as a number greater than 0.");
    }

    let date = new Date(year, 2, 1); // Start from March 1st (month 2)

    while (date.getDay() !== 0) { // Adjust to the first Sunday
        date.setDate(date.getDate() + 1);
    }

    date.setDate(date.getDate() + 7); // Add 7 days to get the second Sunday
    date.setHours(2, 0, 0, 0); // Set time to 2:00 AM
    return date;
}

// Example usage
console.log(getSecondSundayOfMarchAt2AM(2024));

// Entre el 1er domingo de noviembre y el 2o domingo de marzo del año próximo, la zona horaria de varios municipios se alínea con el horario del centro del país.
// Estos son
/*
Baja California: San Quintín, Tecate, Tijuana, Ensenada, Mexicali y Playas de Rosarito.
Chihuahua: Guadalupe, Janos, Juárez, Manuel Benavides, Ojinaga, Praxedis G. Guerrero.Ascención y Coyame del Sotol.
Coahuila: Jiménez, Morelos, Nava, Ocampo, Piedras Negras, Villa Unión, Zaragoza, Acuña, Allende, Hidalgo y Guerrero.
Nuevo León: Anáhuac.
Tamaulipas: Miguel Alemán, Mier, Nuevo Laredo, Reynosa, Río Bravo, Valle Hermoso, Camargo, Guerrero, Gustavo Díaz Ordaz y Matamoros.
*/

function isDateInRange(date, startDate, endDate) {
    // Ensure all inputs are valid Date objects
    if (!(date instanceof Date) || !(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new Error("All arguments must be valid Date objects.");
    }

    // Compare dates directly
    return date >= startDate && date <= endDate;
}

// Example usage
const dateToCheck = new Date(2024, 2, 15); // March 15, 2024
const startDate = new Date(2024, 2, 10); // March 10, 2024
const endDate = new Date(2024, 2, 20); // March 20, 2024

const result = isDateInRange(dateToCheck, startDate, endDate);
console.log(`Is ${dateToCheck.toDateString()} between ${startDate.toDateString()} and ${endDate.toDateString()}? ${result}`);

function tz(edo, mun){
    let estado = edo.replace('_',' ');
    let municipio = mun.replace('_',' ');
  
    const utc7edo = [
        "Baja California",
        "Baja California",
        "Nayarit",
        "Sinaloa",
        "Sonora"
    ];
  
    const utc7munChih = [
        "Janos",
        "Ascensión",
        "Juárez",
        "Praxedis",
        "Guadalupe"
    ];
  
    const utc5edo = [
        "Quintana Roo"
    ];
  
    const utc5munCoah = [
        "Acuña",
        "Allende",
        "Guerrero",
        "Hidalgo",
        "Jiménez",
        "Morelos",
        "Nava",
        "Ocampo",
        "Piedras Negras",
        "Villa Unión",
        "Zaragoza"
    ];
  
    const utc5munNL = [
        "Anáhuac"
    ];
  
    const utc5munTamps = [
        "Nuevo Laredo",
        "Guerrero",
        "Mier",
        "Miguel Alemán",
        "Camargo",
        "Gustavo Díaz Ordaz",
        "Reynosa",
        "Río Bravo",
        "Valle Hermoso",
        "Matamoros"
    ];
  
    let timezone = 'UTC-6';
  
    if(utc7edo.includes(estado)){
        timezone = 'UTC-7';
    }
  
    if(utc5edo.includes(estado)){
        timezone = 'UTC-5';
    }
  
    if(estado === 'Chihuahua' && utc7munChih.includes(municipio)){
        timezone = 'UTC-7';
    }
  
    if(estado === 'Coahuila' && utc5munCoah.includes(municipio)){
        timezone = 'UTC-5';
    }
  
    if(estado === 'Nuevo León' && utc5munNL.includes(municipio)){
        timezone = 'UTC-5';
    }
  
    if(estado === 'Tamaulipas' && utc5munTamps.includes(municipio)){
        timezone = 'UTC-5';
    }
    return timezone;
  }