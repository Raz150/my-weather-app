export const kelvinToCelsius = (kelvin: number): number => {
    return Math.round(kelvin - 273.15);
};

export const convertToDate = (timestamp: number, timezoneOffset: number = 0): string => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    
    return date.toLocaleDateString('en-US', options);
};

export const convertToTime = (timestamp: number, timezoneOffset: number = 0): string => {
    const date = new Date((timestamp + timezoneOffset) * 1000);

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // To use AM/PM format
    };

    return date.toLocaleTimeString('en-US', options);
};