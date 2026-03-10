from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from dotenv import load_dotenv
import os
import json

load_dotenv()

mail = Mail()

def init_firebase():
    try:
        import firebase_admin
        from firebase_admin import credentials
        
        if not firebase_admin._apps:
            cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
            if cred_path and os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                print("[DEBUG] Firebase initialized successfully")
            else:
                firebase_json = os.getenv('FIREBASE_SERVICE_ACCOUNT')
                if firebase_json:
                    cred_dict = json.loads(firebase_json)
                    cred = credentials.Certificate(cred_dict)
                    firebase_admin.initialize_app(cred)
                    print("[DEBUG] Firebase initialized successfully")
                else:
                    print("[WARNING] Firebase credentials not found in environment variables")
    except Exception as e:
        print(f"[WARNING] Firebase initialization failed: {e}")

def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')
    
    CORS(app, resources={r"/api/*": {"origins": os.getenv('FRONTEND_URL')}})
    mail.init_app(app)
    
    init_firebase()
    
    from app.routes import auth, cards, transactions, subscriptions, analytics, statements, exchange_rates
    
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(cards.bp, url_prefix='/api/cards')
    app.register_blueprint(transactions.bp, url_prefix='/api/transactions')
    app.register_blueprint(subscriptions.bp, url_prefix='/api/subscriptions')
    app.register_blueprint(analytics.bp, url_prefix='/api/analytics')
    app.register_blueprint(statements.bp, url_prefix='/api/statements')
    app.register_blueprint(exchange_rates.bp, url_prefix ='/api/exchange-rate')
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'PayWatch API is running'}, 200
    
    return app