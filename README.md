%%writefile README.md

# Groundwater and Water Quality Prediction System

## Project Overview

i) This project uses Machine Learning to predict groundwater and water quality parameters from available water quality data.

ii) The project focuses on predicting important parameters such as pH, nitrate, total hardness, TDS, and conductivity.

iii) The Machine Learning model is developed and tested using Google Colab.

## Machine Learning Notebook

The main notebook is:

`model_prediction.ipynb`

## How to Run

1. Open `model_prediction.ipynb` in Google Colab.
2. Upload the required dataset.
3. Install the required Python libraries.
4. Run the notebook cells from the beginning to the end.
5. The notebook performs data preprocessing, model training, evaluation, and prediction.

## Data

The dataset contains groundwater and water quality parameters such as:

- Nitrate
- Fluoride
- Calcium
- Magnesium
- Bicarbonate
- TDS
- Turbidity
- pH
- Conductivity
- Total Hardness
- Region

## Model Evaluation

The models are evaluated using:

- R² Score
- RMSE
- MAE

## Future Development

Future development will include:

- Rock type prediction
- Rock depth estimation
- Drilling difficulty estimation
- Water quality classification
- Water suitability recommendations
- Web-based prediction interface.
