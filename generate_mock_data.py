import pandas as pd
import random
from datetime import datetime, timedelta
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet

cities = {
    "New York": "USA", "London": "UK", "Paris": "France",
    "Tokyo": "Japan", "Sydney": "Australia", "Rio de Janeiro": "Brazil",
    "Cairo": "Egypt", "Cape Town": "South Africa", "Moscow": "Russia",
    "Dubai": "UAE", "Mumbai": "India", "Toronto": "Canada"
}
start_date = datetime(2025, 7, 1)
end_date = datetime(2025, 12, 31)
peak_months = {7, 8, 12}
airlines = ["Airways Intl", "Global Flights", "Sky High", "Continental Express", "TransWorld Airlines"]
car_base_rates = {"Economy": 30, "Compact": 40, "SUV": 70, "Luxury": 120, "Van": 90}

def make_flights():
    rows = []
    for o_city, o_country in cities.items():
        for d_city, d_country in cities.items():
            if o_city == d_city: continue
            dep = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
            ret = dep + timedelta(days=random.randint(3, 14))
            airline = random.choice(airlines)
            num = f"{airline.split()[0][:2].upper()}{random.randint(100,999)}"
            base = random.randint(300, 1500)
            mult = 1.2 if dep.month in peak_months else 1.0
            adult = round(base * mult)
            child = round(adult * 0.75)
            rows.append([o_country, o_city, d_country, d_city, dep.date(), ret.date(), airline, num, adult, child])
    return pd.DataFrame(rows, columns=[
        "Origin Country","Origin City","Destination Country","Destination City",
        "Departure Date","Return Date","Airline","Flight Number","Adult Price","Child Price"
    ])

def make_cars():
    rows = []
    for city, country in cities.items():
        for ctype, rate in car_base_rates.items():
            for _ in range(3):
                start = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
                dur = random.randint(1,10)
                end = start + timedelta(days=dur)
                mult = 1.2 if start.month in peak_months else 1.0
                adult = round(rate * mult * dur)
                child = dur * 10
                rows.append([country, city, ctype, start.date(), end.date(), adult, child])
    return pd.DataFrame(rows, columns=[
        "Country","City","Car Type","Rental Start","Rental End","Adult Price","Child Price"
    ])

def make_hotels():
    rows = []
    for city, country in cities.items():
        names = [f"{city} Grand Hotel", f"{city} Inn", f"{city} Suites", f"{city} Plaza", f"{city} Palace"]
        for name in names:
            for _ in range(3):
                ci = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
                nights = random.randint(1,7)
                co = ci + timedelta(days=nights)
                base = random.randint(80, 300)
                mult = 1.2 if ci.month in peak_months else 1.0
                a_rate = round(base * mult)
                c_rate = round(a_rate * 0.5)
                rows.append([country, city, name, ci.date(), co.date(), a_rate, c_rate])
    return pd.DataFrame(rows, columns=[
        "Country","City","Hotel Name","Check-in","Check-out","Adult Price Per Night","Child Price Per Night"
    ])

doc = SimpleDocTemplate("mock_travel_data.pdf", pagesize=letter)
styles = getSampleStyleSheet()
elements = []
style = TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#d5d5d5')),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
])

for title, df in [("Flight Data", make_flights()), ("Car Rental Data", make_cars()), ("Hotel Data", make_hotels())]:
    elements.append(Paragraph(title, styles['Heading2']))
    data = [df.columns.tolist()] + df.values.tolist()
    tbl = Table(data, repeatRows=1)
    tbl.setStyle(style)
    elements.append(tbl)
    elements.append(PageBreak())

doc.build(elements)
print("PDF written to mock_travel_data.pdf")