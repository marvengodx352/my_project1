import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.fetchWeather()
  }

  async fetchWeather() {
    try {
      const position = await this.getPosition()
      const { latitude, longitude } = position.coords
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`

      const response = await fetch(url)
      const data = await response.json()

      if (data.current_weather) {
        this.renderWeather(data.current_weather)
      } else {
        this.fallbackWeather()
      }
    } catch (error) {
      this.fallbackWeather()
    }
  }

  getPosition() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      } else {
        reject(new Error("Geolocation not supported"))
      }
    })
  }

  async fallbackWeather() {
    try {
      const url = "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6176&current_weather=true&timezone=auto"
      const response = await fetch(url)
      const data = await response.json()
      if (data.current_weather) {
        this.renderWeather(data.current_weather)
      } else {
        this.showError()
      }
    } catch (e) {
      this.showError()
    }
  }

  renderWeather(weather) {
    const icon = this.weatherIcon(weather.weathercode)
    const temp = weather.temperature
    const desc = this.weatherDescription(weather.weathercode)
    const wind = weather.windspeed

    this.element.innerHTML = `
      <div class="weather-left">
        <span class="weather-icon">${icon}</span>
        <div class="weather-info">
          <h3>${desc}</h3>
          <p>Ветер ${wind} км/ч</p>
        </div>
      </div>
      <div class="weather-temp">${temp}°C</div>
    `
  }

  showError() {
    this.element.innerHTML = '<div class="weather-loading">🌤️ Погода недоступна</div>'
  }

  weatherIcon(code) {
    if (code <= 1) return "☀️"
    if (code === 2) return "⛅"
    if (code === 3) return "☁️"
    if (code <= 49) return "🌫️"
    if (code <= 59) return "🌧️"
    if (code <= 69) return "🌨️"
    if (code <= 79) return "❄️"
    if (code <= 82) return "🌦️"
    if (code <= 86) return "🌨️"
    if (code >= 95) return "⛈️"
    return "🌤️"
  }

  weatherDescription(code) {
    if (code <= 1) return "Ясно"
    if (code === 2) return "Переменная облачность"
    if (code === 3) return "Пасмурно"
    if (code <= 49) return "Туман"
    if (code <= 59) return "Морось"
    if (code <= 69) return "Дождь"
    if (code <= 79) return "Снег"
    if (code <= 82) return "Ливень"
    if (code <= 86) return "Снегопад"
    if (code >= 95) return "Гроза"
    return "Неизвестно"
  }
}