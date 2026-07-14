from pathlib import Path
path = Path(r'C:\Users\tigan\Desktop\stage_initiation\CardioDiab_Predict_v2\Frontend\src\services\axiosClient.js')
text = path.read_text()
print('BEFORE', text.count('Bearer'), text.count('******'))
text = text.replace('    reqConfig.headers.Authorization = `******;', '    reqConfig.headers.Authorization = `Bearer ${token}`;')
path.write_text(text)
print('AFTER', path.read_text().count('Bearer'), path.read_text().count('******'))
