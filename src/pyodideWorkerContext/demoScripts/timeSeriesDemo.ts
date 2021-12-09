const script = `###<Package imports>###
import numpy as np
import pandas as pd
from statsmodels.tsa.stattools import adfuller, acf, pacf
from statsmodels.tsa.arima_model import ARIMA
from statsmodels.tsa.seasonal import seasonal_decompose
###<Context variables>###
from js import timeSeries
###<Script>###

# Load data
ts_py=timeSeries.to_py()
df_ts=pd.DataFrame(data=np.array(ts_py[1:]).astype(float),columns=ts_py[0])

## 1. Find d for stationarity
def test_stationarity(df,window):
    # rolling statistics
    rolling_mean = df.rolling(window=window).mean()
    rolling_std = df.rolling(window=window).std()
    
    # Augmented-Dickey–Fuller test:
    result = adfuller(df)
    
    return {
        "ADF Statistic":result[0],
        "p-value":result[1],
        "Critical Values":dict(result[4].items()),
    }
    
def difference(df,diff):
    df_diff = df - df.shift()
    df_diff.dropna(inplace=True)
    return df_diff
##2. Test for p and q
#Test p
#acf
#Test q
#pacf

##3. Fitting ARIMA
# model = ARIMA(df_ts['value'], order=(2,1,2))
# results = model.fit(disp=-1)
df_ts.index=pd.date_range("1980-1-1", freq="M", periods=99) # Cast the index to date for seasonal decomposition to work.
res=seasonal_decompose(df_ts['value'])
print(res.trend,res.seasonal,res.resid)
`;
export default script;
