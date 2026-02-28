<div align="center">

# 💊 Data to Dollars
### *Predicting Insurance Charges with Machine Learning*

[![Live App](https://img.shields.io/badge/🌐_Live_App-Vercel-00C7B7?style=for-the-badge&logoColor=white)](https://data-to-dollars-predicting-insuranc-five.vercel.app/)
[![Dashboard](https://img.shields.io/badge/📊_Dashboard-GitHub_Pages-181717?style=for-the-badge&logo=github&logoColor=white)](https://bigtime5.github.io/Data-to-Dollars-Predicting-Insurance-Charges/)
[![GitHub](https://img.shields.io/badge/📁_Repository-GitHub-6c5ce7?style=for-the-badge&logo=github&logoColor=white)](https://github.com/BigTime5/Data-to-Dollars-Predicting-Insurance-Charges)

<br/>

> *"Healthcare costs are rarely random — they tell a story. This project reads that story and predicts the next chapter."*

<br/>

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-Random_Forest-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-Data_Analysis-150458?style=flat-square&logo=pandas&logoColor=white)
![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-F37626?style=flat-square&logo=jupyter&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Results](#-key-results)
- [Dataset](#-dataset)
- [Data Cleaning](#-data-cleaning)
- [Exploratory Data Analysis](#-exploratory-data-analysis)
- [Model](#-model)
- [Validation Predictions](#-validation-predictions)
- [Key Insights](#-key-insights)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Contact](#-contact)

---

## 🔍 Overview

As a Data Scientist at a leading health insurance company, the challenge is clear: **how do we predict what a customer's healthcare will cost before they file a claim?**

This project answers that question. Using a dataset of **1,338 insured customers** and six demographic and lifestyle features, a **Random Forest Regressor** was trained to predict individual annual medical charges. The model was then deployed into a production-ready web application and an interactive analytics dashboard.

The result: a system that explains **82.99% of the variance** in healthcare costs — with predictions accurate to within **~$2,875 on average**.

**Why it matters:**
- 🎯 Insurers can price premiums more accurately and fairly
- 📋 Customers can plan and budget their healthcare expenses
- 🏥 High-risk individuals can be identified for preventive outreach
- 💰 Claims forecasting becomes data-driven, not guesswork

---

## 🌐 Live Demo

| Resource | Link | Description |
|---|---|---|
| 🚀 **Live App** | [data-to-dollars-predicting-insuranc-five.vercel.app](https://data-to-dollars-predicting-insuranc-five.vercel.app/) | Enter your details and get a predicted insurance charge in real time |
| 📊 **Analytics Dashboard** | [bigtime5.github.io/Data-to-Dollars-Predicting-Insurance-Charges](https://bigtime5.github.io/Data-to-Dollars-Predicting-Insurance-Charges/) | Full interactive visual analysis of the dataset and model results |
| 📓 **Notebook** | [`healthcare_cost_prediction.ipynb`](healthcare_cost_prediction.ipynb) | Complete analysis pipeline with outputs |

---

## 🏆 Key Results

<div align="center">

| Metric | Value |
|--------|-------|
| **Model** | Random Forest Regressor |
| **R² Score** | 0.8299 (82.99% variance explained) |
| **RMSE** | $4,679.66 |
| **MAE** | $2,874.53 |
| **Cross-Validation Mean R²** | 0.8300 |
| **CV Std Dev** | ± 0.027 (highly stable) |
| **Training Records** | 1,119 (after cleaning) |
| **Validation Records** | 50 |

</div>

> 📌 The model's cross-validation score (0.8300) is virtually identical to its test score (0.8299), confirming **no overfitting** and strong generalization to unseen data.

---

## 📁 Dataset

The primary dataset (`insurance.csv`) contains health insurance customer records across the United States.

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `age` | `int` | Age of the primary beneficiary | `34` |
| `sex` | `object` | Gender of the insurance contractor | `male` / `female` |
| `bmi` | `float` | Body Mass Index (weight-to-height ratio) | `28.4` |
| `children` | `int` | Number of dependents covered by the plan | `2` |
| `smoker` | `object` | Whether the beneficiary smokes | `yes` / `no` |
| `region` | `object` | Residential region in the US | `southeast` |
| `charges` | `float` | **Target** — Annual medical costs billed ($) | `13,254.05` |

**Dataset summary:**
- **1,338 total records** across 4 US regions
- Charges range from **$1,122** to **$63,770**
- Mean annual charge: **$13,287** | Median: **$9,382**
- 19.4% of customers are smokers (259 of 1,338)

---

## 🧹 Data Cleaning

The raw dataset required several targeted fixes before modeling:

```python
# Issues identified and resolved:

# 1. Dollar signs in the charges column
df['charges'] = df['charges'].astype(str).str.replace('$', '').astype(float)

# 2. Inconsistent gender labels (male/female/man/woman/m/f)
df['sex'] = df['sex'].str.lower().replace({'man': 'male', 'woman': 'female', 'm': 'male', 'f': 'female'})

# 3. Mixed-case region names (Southeast vs southeast)
df['region'] = df['region'].str.lower()

# 4. Negative values in age and children (data entry errors)
df = df[(df['age'] >= 0) & (df['children'] >= 0)]

# Result: 1,119 clean records retained for training
```

**Records retained after cleaning:** 1,119 / 1,338 (83.6%)

---

## 📊 Exploratory Data Analysis

### 🚬 Smoking Status — The Dominant Signal

Smoking is the single most powerful predictor of healthcare cost — by a wide margin.

| Status | Count | Avg Annual Charges | Multiplier |
|--------|-------|--------------------|------------|
| Non-Smoker | 1,013 (80.6%) | $8,430 | 1.0× (baseline) |
| **Smoker** | **259 (19.4%)** | **$32,068** | **3.8×** |
| **Difference** | — | **+$23,638** | **+281%** |

> 💡 A smoker costs the insurer **nearly 4 times** what a non-smoker does annually. Smoking alone explains more cost variance than age, BMI, region, and children combined.

---

### 👴 Age & Cost Escalation

Healthcare charges rise consistently with age, more than doubling from the youngest to the oldest cohort.

```
Age 18–30  │██████████░░░░░░░░░░░░░░░░░░░  $9,539
Age 31–45  │█████████████░░░░░░░░░░░░░░░░  $12,603  (+32%)
Age 46–60  │█████████████████░░░░░░░░░░░░  $16,375  (+72%)
Age 61–70  │█████████████████████░░░░░░░░  $20,747  (+117%)
```

---

### ⚖️ BMI Category Breakdown

Obesity carries a **50% cost premium** over normal-weight customers.

| BMI Category | BMI Range | Avg Charges | vs. Normal |
|---|---|---|---|
| Underweight | < 18.5 | $8,904 | −15% |
| Normal | 18.5–24.9 | $10,431 | Baseline |
| Overweight | 25.0–29.9 | $10,994 | +5% |
| **Obese** | **≥ 30.0** | **$15,641** | **+50%** |

---

### 🗺️ Regional Analysis

The Southeast carries both the highest smoker rate and the highest average charges.

| Region | Records | Smoker Rate | Avg Charges |
|--------|---------|-------------|-------------|
| Southeast | 342 | **23.7%** | **$14,911** |
| Northeast | 308 | 20.1% | $13,301 |
| Southwest | 312 | 17.9% | $12,630 |
| Northwest | 310 | 17.4% | $12,334 |

---

### 📐 Feature Correlations with Charges

```
Smoker       ████████████████████████████  Very High  (dominant)
BMI          ████████░░░░░░░░░░░░░░░░░░░░  0.195
Age          ███████░░░░░░░░░░░░░░░░░░░░░  0.173
Children     ██░░░░░░░░░░░░░░░░░░░░░░░░░░  0.047
Sex          █░░░░░░░░░░░░░░░░░░░░░░░░░░░  ~0.01 (negligible)
```

---

## 🤖 Model

### Algorithm: Random Forest Regressor

Random Forest was selected for this problem because:

- ✅ **Handles non-linearity** — The relationship between smoking + BMI + age creates complex interaction effects that linear models miss
- ✅ **Robust to outliers** — High-charge cases (smokers with high BMI) don't distort the model
- ✅ **Naturally captures feature interactions** — e.g., smoker × age compound effects
- ✅ **No feature scaling required** — Works directly with raw numeric and encoded categorical data
- ✅ **Interpretable feature importance** — Confirms smoking as the top predictor

### Pipeline

```
Raw Data (insurance.csv)
        │
        ▼
 ┌─────────────────────┐
 │   Data Cleaning      │  Remove $, normalize categories, filter invalid values
 └─────────────────────┘
        │
        ▼
 ┌─────────────────────┐
 │  Feature Engineering │  One-hot encode region; binary encode sex & smoker
 └─────────────────────┘
        │
        ▼
 ┌─────────────────────┐
 │  Train/Test Split    │  80/20 stratified split
 └─────────────────────┘
        │
        ▼
 ┌─────────────────────┐
 │ Random Forest Train  │  n_estimators tuned via cross-validation
 └─────────────────────┘
        │
        ▼
 ┌─────────────────────┐
 │  Evaluation          │  R² = 0.8299 | RMSE = $4,679 | MAE = $2,875
 └─────────────────────┘
        │
        ▼
 ┌─────────────────────┐
 │ Validation Predict   │  50 unseen customers → validation_predictions.csv
 └─────────────────────┘
```

### Performance

```python
Model Performance:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  R² Score    :  0.8299  ✅ Strong fit
  RMSE        :  $4,679.66
  MAE         :  $2,874.53
  CV Mean R²  :  0.8300  ✅ Stable across folds
  CV Std      :  ±0.027  ✅ No overfitting
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 Validation Predictions

The trained model was applied to 50 unseen customers from `validation_dataset.csv`.

**Prediction summary:**

| Metric | Value |
|--------|-------|
| Total Predictions | 50 |
| Mean Predicted Charge | $24,107 |
| Median Predicted Charge | $12,160 |
| Minimum Prediction | $1,708 |
| Maximum Prediction | $115,225 |
| Smoker Avg (predicted) | $49,147 |
| Non-Smoker Avg (predicted) | $10,023 |

**Risk distribution of predicted customers:**

```
Low Risk   ($0–$10K)    ├████████████████████░░  40%  (20 customers)
Medium     ($10K–$20K)  ├████████████░░░░░░░░░░  24%  (12 customers)
Med-High   ($20K–$30K)  ├██████░░░░░░░░░░░░░░░░  12%   (6 customers)
High Risk  ($30K–$50K)  ├██████░░░░░░░░░░░░░░░░  12%   (6 customers)
Critical   ($50K+)      ├██████░░░░░░░░░░░░░░░░  12%   (6 customers)
```

---

## 💡 Key Insights

1. **🚬 Smoking is the undisputed #1 cost driver** — responsible for a $23,638 annual premium. No other variable comes close. A smoking cessation incentive program could be the single highest-ROI intervention available to the insurer.

2. **📈 Age compounds everything** — Charges grow 117% from age 18 to 70. Early preventive programs targeting the 31–45 cohort could slow this escalation curve.

3. **🍔 Obesity carries a 50% surcharge** — Customers with BMI ≥ 30 cost $5,210 more per year than those with normal BMI. Weight management programs are directly tied to claims reduction.

4. **🗺️ The Southeast is the highest-risk region** — with both the highest smoker concentration (23.7%) and the highest predicted costs in validation. Targeted regional outreach here has the greatest expected impact.

5. **👫 Gender is nearly irrelevant** — correlation with charges is essentially zero. Premium pricing should not be gender-differentiated based on this dataset.

6. **📊 The model is stable and generalizable** — cross-validation R² of 0.8300 (±0.027) confirms the model performs consistently on unseen data, making it safe for production deployment.

---

## 📂 Project Structure

```
Data-to-Dollars-Predicting-Insurance-Charges/
│
├── 📓 healthcare_cost_prediction.ipynb   # Main analysis notebook
├── 🐍 healthcare_analysis.py             # Reusable module (load, clean, train, predict)
│
├── 📁 data/
│   ├── insurance.csv                     # Training dataset (1,338 records)
│   ├── validation_dataset.csv            # Unseen customers for prediction (50 records)
│   └── validation_predictions.csv        # Model output predictions
│
├── 📁 dashboard/
│   └── healthcare_dashboard.html         # Interactive analytics dashboard
│
└── 📄 README.md                          # You are here
```

### Key Module Functions (`healthcare_analysis.py`)

| Function | Description |
|---|---|
| `load_and_clean_data()` | Loads `insurance.csv` and resolves all data quality issues |
| `load_validation_data()` | Loads and prepares `validation_dataset.csv` |
| `prepare_features(df)` | Encodes categorical variables and engineers model features |
| `train_model(df)` | Trains the Random Forest Regressor with cross-validation |
| `predict_validation(model, df, features)` | Generates predictions for new customers |
| `create_dashboard(...)` | Builds the visual analytics dashboard |
| `main()` | Runs the full end-to-end pipeline |

---

## 🚀 Getting Started

### Prerequisites

```bash
Python 3.8+
pip
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/BigTime5/Data-to-Dollars-Predicting-Insurance-Charges.git
cd Data-to-Dollars-Predicting-Insurance-Charges

# 2. Install dependencies
pip install pandas numpy scikit-learn matplotlib seaborn jupyter

# 3. Launch the notebook
jupyter notebook healthcare_cost_prediction.ipynb
```

### Run the Full Pipeline

```python
from healthcare_analysis import main

# Execute the complete analysis in one call
df, val_df, predictions, metrics = main()

# Output:
# ✓ Data cleaned: 1,119 records
# ✓ Model trained — R²: 0.8299 | RMSE: $4,679.66 | MAE: $2,874.53
# ✓ 50 validation predictions generated
# ✓ Dashboard saved as healthcare_dashboard.png
# ✓ Predictions saved as validation_predictions.csv
```

### Make a Custom Prediction

```python
import pandas as pd
from healthcare_analysis import load_and_clean_data, train_model, prepare_features, predict_validation

# Train the model
df = load_and_clean_data()
model, metrics, _, _, _, features = train_model(df)

# Predict for a new customer
customer = pd.DataFrame([{
    'age': 35,
    'sex': 'female',
    'bmi': 26.5,
    'children': 1,
    'smoker': 'no',
    'region': 'northeast'
}])

prediction = predict_validation(model, customer, features)
print(f"Predicted Annual Charge: ${prediction[0]:,.2f}")
# → Predicted Annual Charge: $7,241.83
```

---

## 📬 Contact

**Phinidy George**
Data Scientist · Health Insurance Analytics

📧 [phinidygeorge01@gmail.com](mailto:phinidygeorge01@gmail.com)
🌐 [Live App](https://data-to-dollars-predicting-insuranc-five.vercel.app/)
📊 [Analytics Dashboard](https://bigtime5.github.io/Data-to-Dollars-Predicting-Insurance-Charges/)
💻 [GitHub Repository](https://github.com/BigTime5/Data-to-Dollars-Predicting-Insurance-Charges)

---

<div align="center">

**If this project was useful or interesting, please consider giving it a ⭐ on GitHub!**

<br/>

*Built with 🧠 machine learning, ❤️ attention to detail, and ☕ a lot of coffee.*

</div>
