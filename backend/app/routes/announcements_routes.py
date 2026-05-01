import json
import os
from flask import Blueprint, jsonify, request
from datetime import datetime
import requests

announcements_bp = Blueprint('announcements', __name__)

ANNOUNCEMENTS_FILE = os.path.join(os.path.dirname(__file__), '../../data/announcements.json')
OPENWEATHERMAP_API_KEY = os.getenv('OPENWEATHERMAP_API_KEY')
OPENWEATHERMAP_URL = 'https://api.openweathermap.org/data/2.5/weather'


def load_announcements():
    """Load general announcements from JSON file."""
    try:
        with open(ANNOUNCEMENTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f'Error loading announcements: {e}')
        return []


def generate_weather_alerts(lat, lon):
    """Fetch weather data and generate alerts based on thresholds."""
    alerts = []
    try:
        response = requests.get(
            OPENWEATHERMAP_URL,
            params={
                'lat': lat,
                'lon': lon,
                'units': 'metric',
                'appid': OPENWEATHERMAP_API_KEY
            },
            timeout=5
        )

        if response.status_code != 200:
            return alerts

        data = response.json()
        temp = data.get('main', {}).get('temp', 0)
        weather = data.get('weather', [{}])[0].get('main', '')
        wind_speed = data.get('wind', {}).get('speed', 0)
        rain_1h = data.get('rain', {}).get('1h', 0)

        # Thunderstorm alert
        if weather == 'Thunderstorm':
            alerts.append({
                'id': 'alert_thunderstorm',
                'type': 'weather',
                'severity': 'high',
                'title_en': 'Thunderstorm Warning',
                'title_ur': 'بجلی کے طوفان کی انتباہ',
                'body_en': 'A thunderstorm is approaching your area. Secure your crops and livestock.',
                'body_ur': 'آپ کے علاقے میں بجلی کے طوفان کا امکان ہے۔ اپنی فصل اور مویشیوں کو محفوظ رکھیں۔',
                'date': datetime.utcnow().isoformat() + 'Z'
            })

        # Extreme heat alert (>40°C)
        if temp > 40:
            alerts.append({
                'id': 'alert_extreme_heat',
                'type': 'weather',
                'severity': 'high',
                'title_en': 'Extreme Heat Alert',
                'title_ur': 'شدید گرمی کی انتباہ',
                'body_en': f'Temperature is {temp}°C. Increase irrigation frequency to prevent crop stress.',
                'body_ur': f'درجہ حرارت {temp}°C ہے۔ فصل کے دباؤ سے بچنے کے لیے آبپاشی میں اضافہ کریں۔',
                'date': datetime.utcnow().isoformat() + 'Z'
            })
        # Heat stress advisory (35-40°C)
        elif temp > 35:
            alerts.append({
                'id': 'alert_heat_stress',
                'type': 'weather',
                'severity': 'medium',
                'title_en': 'Heat Stress Advisory',
                'title_ur': 'گرمی کے دباؤ کی صلاح',
                'body_en': f'Temperature is {temp}°C. Monitor your crops for heat stress symptoms.',
                'body_ur': f'درجہ حرارت {temp}°C ہے۔ فصل میں گرمی کے دباؤ کی علامات پر نظر رکھیں۔',
                'date': datetime.utcnow().isoformat() + 'Z'
            })

        # Frost warning (<5°C)
        if temp < 5:
            alerts.append({
                'id': 'alert_frost',
                'type': 'weather',
                'severity': 'high',
                'title_en': 'Frost Warning',
                'title_ur': 'برفانی تودے کی انتباہ',
                'body_en': f'Temperature is {temp}°C. Frost may damage your crops. Take preventive measures.',
                'body_ur': f'درجہ حرارت {temp}°C ہے۔ برفانی تودے سے فصل کو نقصان ہو سکتا ہے۔',
                'date': datetime.utcnow().isoformat() + 'Z'
            })

        # Heavy rainfall alert
        if weather in ['Rain', 'Drizzle'] and rain_1h > 10:
            alerts.append({
                'id': 'alert_heavy_rain',
                'type': 'weather',
                'severity': 'medium',
                'title_en': 'Heavy Rainfall Advisory',
                'title_ur': 'بھاری بارش کی صلاح',
                'body_en': f'{rain_1h:.1f}mm of rain expected. Ensure proper drainage to prevent waterlogging.',
                'body_ur': f'{rain_1h:.1f}ملی میٹر بارش کی توقع ہے۔ پانی بھرنے سے بچنے کے لیے صحیح نکاسی یقینی بنائیں۔',
                'date': datetime.utcnow().isoformat() + 'Z'
            })

        # Strong wind advisory
        if wind_speed > 15:
            alerts.append({
                'id': 'alert_strong_wind',
                'type': 'weather',
                'severity': 'medium',
                'title_en': 'Strong Wind Advisory',
                'title_ur': 'تیز ہواؤں کی صلاح',
                'body_en': f'Wind speed is {wind_speed:.1f} m/s. Strong winds may damage crops. Secure vulnerable plants.',
                'body_ur': f'ہوا کی رفتار {wind_speed:.1f} میٹر/سیکنڈ ہے۔ تیز ہوائیں فصل کو نقصان پہنچا سکتی ہیں۔',
                'date': datetime.utcnow().isoformat() + 'Z'
            })

    except Exception as e:
        print(f'Error generating weather alerts: {e}')

    return alerts


@announcements_bp.route('/announcements', methods=['GET'])
def get_announcements():
    """Get announcements and weather alerts."""
    announcements = load_announcements()

    # Get latitude and longitude from query params
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    # Generate weather alerts if location is provided
    weather_alerts = []
    if lat is not None and lon is not None:
        weather_alerts = generate_weather_alerts(lat, lon)

    # Combine weather alerts and general announcements
    # Weather alerts first (more urgent), then general announcements
    all_announcements = weather_alerts + announcements

    return jsonify(all_announcements)
