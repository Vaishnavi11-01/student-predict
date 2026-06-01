import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os


# =====================================================
# DUMMY DATA GENERATION
# =====================================================


def generate_dummy_data(n_samples=1000):
    """Generate dummy student data for training"""
    np.random.seed(42)
    
    data = []
    for i in range(n_samples):
        # Academic features
        avg_score = np.random.uniform(40, 100)
        attendance_rate = np.random.uniform(50, 100)
        weak_subjects = np.random.randint(0, 5)
        absence_streak = np.random.randint(0, 10)
        score_trend = np.random.uniform(-5, 5)
        
        # Demographic features
        income_tier = np.random.randint(1, 6)
        
        # Dropout label (based on features - realistic pattern)
        # Higher risk if: low score, low attendance, high absence streak, low income
        dropout_prob = (
            (100 - avg_score) / 100 * 0.3 +
            (100 - attendance_rate) / 100 * 0.3 +
            absence_streak / 10 * 0.2 +
            (6 - income_tier) / 5 * 0.2
        )
        dropout = 1 if dropout_prob > 0.5 else 0
        
        data.append({
            'avg_score': avg_score,
            'attendance_rate': attendance_rate,
            'weak_subjects': weak_subjects,
            'absence_streak': absence_streak,
            'score_trend': score_trend,
            'income_tier': income_tier,
            'dropout': dropout
        })
    
    return pd.DataFrame(data)


# =====================================================
# MODEL TRAINING
# =====================================================


def train_dropout_model(df):
    """Train RandomForest classifier for dropout prediction"""
    
    # Features and target
    X = df.drop(columns=['dropout'])
    y = df['dropout']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        class_weight='balanced',
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print("\n" + "="*50)
    print("MODEL TRAINING RESULTS")
    print("="*50)
    print(f"\nAccuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance)
    
    return model


# =====================================================
# SAVE MODEL
# =====================================================


def save_model(model, filename='dropout_model.pkl'):
    """Save trained model to file"""
    model_dir = '../models'
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, filename)
    joblib.dump(model, model_path)
    print(f"\nModel saved to: {model_path}")


# =====================================================
# MAIN
# =====================================================


if __name__ == "__main__":
    # Generate dummy data
    print("Generating dummy training data...")
    df = generate_dummy_data(n_samples=1000)
    print(f"Generated {len(df)} samples")
    print(f"\nDropout distribution:")
    print(df['dropout'].value_counts())
    
    # Train model
    print("\nTraining RandomForest classifier...")
    model = train_dropout_model(df)
    
    # Save model
    save_model(model)
    
    print("\n" + "="*50)
    print("TRAINING COMPLETE")
    print("="*50)
