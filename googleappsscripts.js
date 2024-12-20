function doGet(req) {
    return ContentService.createTextOutput(JSON.stringify(
      sessionAvailable(
        req.parameter.day,
        req.parameter.month,
        req.parameter.year,
        req.parameter.hour,
        req.parameter.minute,
        req.parameter.duration_mins
      )
    )).setMimeType(ContentService.MimeType.JSON);
  }
  
  function doPost(req) {
    return ContentService.createTextOutput(JSON.stringify(
      reserve(
        req.parameter.day,
        req.parameter.month,
        req.parameter.year,
        req.parameter.hour,
        req.parameter.minute,
        req.parameter.duration_mins,
        req.parameter.town,
        req.parameter.state,
        req.parameter.timezone,
        req.parameter.phone,
        req.parameter.name
      )
    )).setMimeType(ContentService.MimeType.JSON);
  }
  
  function reserve(
    day,
    month,
    year,
    hour,
    minutes,
    duration_mins,
    town,
    state,
    timezone,
    phone,
    name
  ) {
    var calendar = CalendarApp.getCalendarById('yourcalendarid@group.calendar.google.com');
    const start1 = new Date(year, month, day, hour, minutes, 0);
  
    const ahora = new Date();
    const horVerano = horarioVerano(ahora);
    const myUtc = determinarZonaHoraria(horVerano, "Tamaulipas", 'Matamoros');
    const theirUtc = determinarZonaHoraria(horVerano, state, town);
    // const utc = tz(state, town);
    // let offset = 0;
    // if (utc === 'UTC-6') {
    //   offset = 1;
    // }
    // if (utc === 'UTC-7') {
    //   offset = 2;
    // }
  
    const myUtcVal = myUtc.split('-')[1];
    const theirUtcVal = theirUtc.split('-')[1];
  
    let offset = theirUtcVal - myUtcVal;
  
    const start = new Date(start1.setTime(start1.getTime() + (offset * 60 * 60 * 1000)));
    const start2 = new Date(start);
    const end = new Date(start2.setTime(start2.getTime() + (duration_mins * 60 * 1000)));
    let created;
    try {
      created = calendar.createEvent(phone, start, end, {
        description: `Booked: ${ahora.toString()}\nScheduled: ${start1.toString()}\n${name}\n${town}\n${state}\nAI ${timezone}\nTZ ${utc}`,
      });
    } catch (e) {
      return { output: e };
    }
  
    if (created) {
      return { output: created.getId() };
    } else {
      return { output: 'none' };
    }
  }
  
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
  
  function horarioVerano(date) {
    const year = new Date().getFullYear();
    const date1 = getSecondSundayOfMarchAt2AM(year);
    const date2 = getFirstSundayOfNovemberAt2AM(year);
    return date > date1 && date < date2;
  }
  
  function determinarZonaHoraria(esHorarioVerano, estado, municipio) {
    const zonaSureste = ["Quintana Roo"];
    const zonaCentro = [
      "Aguascalientes", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima",
      "Ciudad de México", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco",
      "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
      "Querétaro", "San Luis Potosí", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz",
      "Yucatán", "Zacatecas"
    ];
    const zonaPacifico = ["Baja California Sur", "Colima", "Nayarit", "Sinaloa", "Sonora"];
    const zonaNoroeste = ["Baja California"];
  
    const municipiosHorarioEspecial = {
      // De UTC-7 a UTC-6
      "Chihuahua": ["Janos", "Ascensión", "Juárez", "Praxedis G. Guerrero", "Guadalupe"],
      // De UTC-6 a UTC-5
      "Chihuahua": ["Coyame del Sotol", "Ojinaga", "Manuel Benavides"],
      "Coahuila": ["Acuña", "Allende", "Guerrero", "Hidalgo", "Jiménez", "Morelos", "Nava", "Ocampo", "Piedras Negras", "Villa Unión", "Zaragoza"],
      "Nuevo León": ["Anáhuac"],
      "Tamaulipas": ["Nuevo Laredo", "Guerrero", "Mier", "Miguel Alemán", "Camargo", "Gustavo Díaz Ordaz", "Reynosa", "Río Bravo", "Valle Hermoso", "Matamoros"]
    };
  
    if (zonaSureste.includes(estado)) {
      return "UTC-5";
    }
  
    if (zonaCentro.includes(estado)) {
      if (municipiosHorarioEspecial[estado] && municipiosHorarioEspecial[estado].includes(municipio)) {
        return esHorarioVerano ? "UTC-5" : "UTC-6";
      }
      return "UTC-6";
    }
  
    if (zonaPacifico.includes(estado)) {
      if (estado === "Nayarit" && municipio === "Bahía de Banderas") {
        return "UTC-6";
      }
      return "UTC-7";
    }
  
    if (zonaNoroeste.includes(estado)) {
      return esHorarioVerano ? "UTC-7" : "UTC-8";
    }
  
    return "UTC-6";
  }
  
  function tz(edo, mun) {
    let estado = edo.replace('_', ' ');
    let municipio = mun.replace('_', ' ');
  
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
  
    if (utc7edo.includes(estado)) {
      timezone = 'UTC-7';
    }
  
    if (utc5edo.includes(estado)) {
      timezone = 'UTC-5';
    }
  
    if (estado === 'Chihuahua' && utc7munChih.includes(municipio)) {
      timezone = 'UTC-7';
    }
  
    if (estado === 'Coahuila' && utc5munCoah.includes(municipio)) {
      timezone = 'UTC-5';
    }
  
    if (estado === 'Nuevo León' && utc5munNL.includes(municipio)) {
      timezone = 'UTC-5';
    }
  
    if (estado === 'Tamaulipas' && utc5munTamps.includes(municipio)) {
      timezone = 'UTC-5';
    }
    return timezone;
  }
  
  function sessionAvailable(day, month, year, hour, minutes, duration_mins) {
    const calendarId = 'yourcalendarid@group.calendar.google.com'; // hypnosis calendar
    const start = new Date(year, month, day, hour, minutes, 0);
    const start2 = new Date(start);
    const end = new Date(start2.setTime(start2.getTime() + (duration_mins * 60 * 1000)));
    console.log(start.toISOString());
    console.log(end.toISOString());
    const events = Calendar.Events.list(calendarId, {
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    if (!events.items || events.items.length === 0) {
      return { count: 0 }; //////////////////////////////////// Return the fucking date too so robo bot can add it to the instructions of assistant Valeria
    }
    return { count: events.items.length };
  }
  
  function freeHours(day, state) {
    const week = [
      'Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.',
    ];
    const year = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    const hours = [
      10, 11, 12, 13, 14, 15, 16, 17, 18, 19
    ];
    const hourshuman = [
      "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM"
    ];
    const workhours = [
      1, 1, 1, 1, 0, 0, 1, 1, 1, 1
    ];
    const workhourslen = workhours.filter(x => x).length;
    let availability = workhours.slice();
    const dayarr = day.split(' ');
    const weekday = dayarr[0];
    const daynum = dayarr[1];
    const month = year.indexOf(dayarr[2]);
    const yearnum = dayarr[3];
    const start = new Date(yearnum, month, daynum, 0);
    const events = eventsNextDays(0, start);
    for (let i = 0; i < events.length; i++) {
      let hourdate = new Date(events[i].start.dateTime);
      let hour = hourdate.getHours();
      let hrix = hours.indexOf(hour);
      availability[hrix] = 0;
    }
    let subtracthr = 0;
    if (
      state === 'Baja California Sur' ||
      state === 'Baja California' ||
      state === 'Nayarit' ||
      state === 'Sonora' ||
      state === 'Sinaloa'
    ) {
      subtracthr = 2;
    } else if (
      state === 'Quintana Roo'
    ) {
      subtracthr = 0;
    } else {
      subtracthr = 1;
    }
    let output = {};
    let ctr = 0;
    for (let i = 0; i < availability.length; i++) {
      if (availability[i]) {
        let hrcomp = hourshuman[i].split(' ')[0];
        let ampm = hourshuman[i].split(' ')[1];
        let hr = hrcomp - subtracthr;
        if (hr === -1) {
          hr = 11;
          ampm = 'AM';
        }
        if (hr === 0) {
          hr = 12;
          ampm = 'PM';
        }
        if (hr === 11) {
          ampm = 'AM';
        }
        if (hr === 10) {
          ampm = 'AM';
        }
        output[`h${ctr + 1}`] = `${hr} ${ampm}`;
        ctr++;
      }
    }
    output['count'] = ctr;
    for (let i = ctr; i < workhourslen; i++) {
      output[`h${i + 1}`] = "none";
    }
    return output;
  }
  
  function freeDays(days, startDate) {
    const week = [
      'Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.',
    ];
    const year = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    const workweek = [
      0, 0, 0, 1, 1, 1, 0,
    ];
    const hours = [
      10, 11, 12, 13, 14, 15, 16, 17, 18, 19
    ];
    const workhours = [
      1, 1, 1, 1, 0, 0, 1, 1, 1, 1
    ];
    const events = eventsNextDays(days, startDate);
    const firstDate = startDate;
    const start = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate(), firstDate.getMonth(), 0);
    let sched = {};
    for (let i = 0; i < days; i++) {
      let start2 = new Date(start);
      let currDate = new Date(start2.setDate(start2.getDate() + i));
      let currYear = currDate.getFullYear();
      let currMonth = currDate.getMonth();
      let currDay = currDate.getDate();
      let key = `d-${currYear}-${currMonth}-${currDay}`;
      sched[key] = 0;
    }
    for (let i = 0; i < events.length; i++) {
      let currDate = new Date(events[i].start.dateTime);
      let currYear = currDate.getFullYear();
      let currMonth = currDate.getMonth();
      let currDay = currDate.getDate();
      let key = `d-${currYear}-${currMonth}-${currDay}`;
      sched[key]++;
    }
    const workhourslen = workhours.filter(x => x).length;
    let workweeklen = 0;
    for (let i = 0, j = 0; i < days; i++, j++) {
      workweeklen += workweek[j];
      if (j > workweek.length - 2) {
        j = 0;
      }
    }
    let freeDaysArr = new Array(workweeklen);
    let ctr = 0;
    for (let i = 0; i < days; i++) {
      let start2 = new Date(start);
      let currDate = new Date(start2.setDate(start2.getDate() + i));
      let currYear = currDate.getFullYear();
      let currMonth = currDate.getMonth();
      let currDay = currDate.getDate();
      let currWeekday = currDate.getDay();
      let key = `d-${currYear}-${currMonth}-${currDay}`;
      if (workweek[currWeekday]) {
        if (sched[key] < workhourslen) {
          freeDaysArr[ctr] = `${week[currWeekday]} ${currDay} ${year[currMonth]} ${currYear}`;
          ctr++;
        }
      }
    }
    let output = { count: ctr };
    for (let i = 0; i < workweeklen; i++) {
      if (freeDaysArr[i]) {
        output[`d${i + 1}`] = freeDaysArr[i];
      } else {
        output[`d${i + 1}`] = "none";
      }
    }
    return output;
  }
  
  function eventsNextDays(days, startDate) {
    const calendarId = 'yourcalendarid@group.calendar.google.com'; // hypnosis calendar
    const now = startDate;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getMonth(), 0);
    const now2 = new Date(now);
    const then = new Date(now2.setDate(now2.getDate() + days));
    const end = new Date(then.getFullYear(), then.getMonth(), then.getDate(), 23, 59, 59, 999);
    const events = Calendar.Events.list(calendarId, {
      timeMin: now.toISOString(),
      timeMax: end.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    if (!events.items || events.items.length === 0) {
      return [];
    }
    return events.items;
  }
  
  function createCalendarEvent(dateday, time, state, user, description) {
    const year = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    const dayarr = dateday.split(' ');
    const weekday = dayarr[0];
    const daynum = dayarr[1];
    const month = year.indexOf(dayarr[2]);
    const yearnum = dayarr[3];
  
    let addhr = 0;
    if (
      state === 'Baja California Sur' ||
      state === 'Baja California' ||
      state === 'Nayarit' ||
      state === 'Sonora' ||
      state === 'Sinaloa'
    ) {
      addhr = 2;
    } else if (
      state === 'Quintana Roo'
    ) {
      addhr = 0;
    } else {
      addhr = 1;
    }
  
    const hours = [
      10, 11, 12, 13, 14, 15, 16, 17, 18, 19
    ];
    const hourshuman = [
      "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM"
    ];
  
    // Matamoros time. Please update to handle proper timezones later.
    let hrix = hourshuman.indexOf(time);
    const hr = hours[hrix] + addhr;
  
    const start = new Date(yearnum, month, daynum, hr);
    const end = new Date(yearnum, month, daynum, hr + 1);
  
    var calendar = CalendarApp.getCalendarById('yourcalendarid@group.calendar.google.com');
    let created;
    console.log(user, start, end, description)
    try {
      created = calendar.createEvent(user, start, end, {
        description: `${description} / ${state}`,
      });
    } catch (e) {
      return { output: e };
    }
  
    if (created) {
      return { output: created.getId() };
    } else {
      return { output: 'none' };
    }
  }
  
  function createNextWeekdayDate(dia, timeString, timeZone) {
    var today = new Date();
    var dayOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    var targetDay = dayOfWeek.indexOf(dia);
  
    if (targetDay === -1) {
      throw new Error('Día de la semana no válido: ' + dia);
    }
  
    var daysUntilTarget = (targetDay + 7 - today.getDay()) % 7;
    if (daysUntilTarget === 0) {
      daysUntilTarget = 7;
    }
  
    var targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    targetDate.setHours(0, 0, 0, 0);
  
    var [hour, minute] = convertTo24Hour(timeString).split(':').map(Number);
    targetDate.setHours(hour, minute, 0, 0);
  
    return convertToTimeZone(targetDate, timeZone);
  }
  
  function convertTo24Hour(time) {
    var hours = parseInt(time.match(/^(\d{1,2})/)[1]);
    var minutes = '00'; // No hay minutos especificados en el formato original, por lo que asumimos '00'
    if (time.indexOf('AM') !== -1 && hours === 12) {
      hours = 0;
    } else if (time.indexOf('PM') !== -1 && hours < 12) {
      hours += 12;
    }
    return ('0' + hours).slice(-2) + ':' + minutes; // Devolver en formato HH:MM
  }
  
  function convertToTimeZone(date, timeZone) {
    var options = {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    var formatter = new Intl.DateTimeFormat([], options);
    var parts = formatter.formatToParts(date);
    var year = parts.find(part => part.type === 'year').value;
    var month = parts.find(part => part.type === 'month').value;
    var day = parts.find(part => part.type === 'day').value;
    var hour = parts.find(part => part.type === 'hour').value;
    var minute = parts.find(part => part.type === 'minute').value;
    var second = parts.find(part => part.type === 'second').value;
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  }
  
  function convertToValidTimeZone(zone) {
    var validTimeZones = {
      'UTC-12': 'Etc/GMT+12',
      'UTC-11': 'Etc/GMT+11',
      'UTC-10': 'Etc/GMT+10',
      'UTC-9': 'Etc/GMT+9',
      'UTC-8': 'Etc/GMT+8',
      'UTC-7': 'Etc/GMT+7',
      'UTC-6': 'Etc/GMT+6',
      'UTC-5': 'Etc/GMT+5',
      'UTC-4': 'Etc/GMT+4',
      'UTC-3': 'Etc/GMT+3',
      'UTC-2': 'Etc/GMT+2',
      'UTC-1': 'Etc/GMT+1',
      'UTC+0': 'Etc/GMT',
      'UTC+1': 'Etc/GMT-1',
      'UTC+2': 'Etc/GMT-2',
      'UTC+3': 'Etc/GMT-3',
      'UTC+4': 'Etc/GMT-4',
      'UTC+5': 'Etc/GMT-5',
      'UTC+6': 'Etc/GMT-6',
      'UTC+7': 'Etc/GMT-7',
      'UTC+8': 'Etc/GMT-8',
      'UTC+9': 'Etc/GMT-9',
      'UTC+10': 'Etc/GMT-10',
      'UTC+11': 'Etc/GMT-11',
      'UTC+12': 'Etc/GMT-12'
    };
    return validTimeZones[zone] || 'Etc/GMT';
  }