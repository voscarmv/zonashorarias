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