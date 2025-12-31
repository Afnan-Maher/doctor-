from flask import Flask, render_template, request, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import json

app = Flask(__name__, static_folder='static', template_folder='templates')

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key_here' # Change this for production

db = SQLAlchemy(app)

# --- Database Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False) # In production, hash this!
    photo = db.Column(db.String(200), default='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop')

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(50), nullable=False)
    experience = db.Column(db.Integer)
    photo = db.Column(db.String(200))
    rating = db.Column(db.Float)
    reviews = db.Column(db.Integer)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    about = db.Column(db.Text)
    # Storing times as JSON string for simplicity in this demo
    available_times = db.Column(db.Text) 

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    status = db.Column(db.String(20), default='confirmed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    doctor = db.relationship('Doctor', backref='bookings')
    user = db.relationship('User', backref='bookings')

# --- Helper: Seed Database with doctors.js data ---
def seed_database():
    if Doctor.query.first(): return # Already seeded
    
    # Data from your doctors.js
    doctors_data = [
        {"name": "Dr. Sarah Johnson", "specialty": "Cardiology", "experience": 15, "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop", "rating": 4.9, "reviews": 156, "phone": "+1 (555) 123-4567", "email": "sarah.johnson@hospital.com", "about": "Dr. Sarah Johnson is a board-certified cardiologist...", "availableTimes": ["2024-12-05 09:00", "2024-12-05 10:00"]},
        {"name": "Dr. Michael Chen", "specialty": "Pediatrics", "experience": 12, "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop", "rating": 4.8, "reviews": 203, "phone": "+1 (555) 234-5678", "email": "michael.chen@hospital.com", "about": "Dr. Michael Chen is dedicated to providing comprehensive care...", "availableTimes": ["2024-12-05 08:00", "2024-12-05 09:30"]},
        # Add the rest of your doctors here...
    ]

    for d in doctors_data:
        new_doc = Doctor(
            name=d['name'], specialty=d['specialty'], experience=d['experience'],
            photo=d['photo'], rating=d['rating'], reviews=d['reviews'],
            phone=d['phone'], email=d['email'], about=d['about'],
            available_times=json.dumps(d['availableTimes'])
        )
        db.session.add(new_doc)
    
    # Create a demo user
    if not User.query.filter_by(email="demo@user.com").first():
        demo_user = User(name="Demo User", email="demo@user.com", password="password")
        db.session.add(demo_user)
        
    db.session.commit()
    print("Database seeded successfully!")

# --- Routes: Pages ---
@app.route('/')
@app.route('/index.html')
def index(): return render_template('index.html')

@app.route('/find-doctor.html')
def find_doctor(): return render_template('find-doctor.html')

@app.route('/doctor-details.html')
def doctor_details(): return render_template('doctor-details.html')

@app.route('/my-bookings.html')
def my_bookings(): return render_template('my-bookings.html')

# --- Routes: API (JSON) ---

# 1. Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email')).first()
    
    # Simple password check (Hash this in real apps!)
    if user and user.password == data.get('password'):
        session['user_id'] = user.id
        return jsonify({
            "success": True, 
            "user": {"id": user.id, "name": user.name, "email": user.email, "photo": user.photo}
        })
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"success": True})

@app.route('/api/current_user', methods=['GET'])
def get_current_user():
    if 'user_id' not in session:
        return jsonify(None)
    user = User.query.get(session['user_id'])
    return jsonify({"id": user.id, "name": user.name, "email": user.email, "photo": user.photo})

# 2. Get Doctors
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    result = []
    for d in doctors:
        result.append({
            "id": str(d.id), # Frontend expects strings for IDs sometimes
            "name": d.name,
            "specialty": d.specialty,
            "experience": d.experience,
            "photo": d.photo,
            "rating": d.rating,
            "reviews": d.reviews,
            "phone": d.phone,
            "email": d.email,
            "about": d.about,
            "availableTimes": json.loads(d.available_times)
        })
    return jsonify(result)

# 3. Bookings
@app.route('/api/bookings', methods=['GET', 'POST'])
def handle_bookings():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    if request.method == 'GET':
        bookings = Booking.query.filter_by(user_id=session['user_id']).all()
        result = []
        for b in bookings:
            result.append({
                "id": str(b.id),
                "doctorName": b.doctor.name,
                "specialty": b.doctor.specialty,
                "date": b.date,
                "time": b.time,
                "status": b.status
            })
        return jsonify(result)

    if request.method == 'POST':
        data = request.json
        new_booking = Booking(
            user_id=session['user_id'],
            doctor_id=int(data['doctorId']),
            date=data['date'],
            time=data['time']
        )
        db.session.add(new_booking)
        db.session.commit()
        return jsonify({"success": True})

@app.route('/api/bookings/<int:id>', methods=['DELETE'])
def cancel_booking(id):
    if 'user_id' not in session: return jsonify({"error": "Unauthorized"}), 401
    
    booking = Booking.query.get(id)
    if booking and booking.user_id == session['user_id']:
        db.session.delete(booking)
        db.session.commit()
        return jsonify({"success": True})
    return jsonify({"error": "Not found"}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_database()
    app.run(debug=True, port=5000)