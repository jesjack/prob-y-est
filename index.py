import math
import statistics


class datos_agrupados:
  def __init__(self, tabla: list[list]):
    self.tabla = tabla
  
  def F(self, index): # frecuencia acumulada
    frecuencia = 0
    for i in range(len(self.tabla)):
      frecuencia += self.tabla[i][1]
      if i == index:
        return frecuencia

  def clase(self, i): return self.tabla[i][0] # rango de datos
  def x_i(self, i): return ( self.tabla[i][0][0] + self.tabla[i][0][1] ) / 2 # punto medio o marca de la clase
  def f_i(self, i): return self.tabla[i][1] # frecuencia absoluta
  def log_x_i(self, i): return math.log(self.x_i(i), 10) # logaritmo de x_i
  def f_log_x_i(self, i): return self.f_i(i) * self.log_x_i(i) # f_i * log(x_i)
  def x_i_f_i(self, i): return self.x_i(i) * self.f_i(i) # x_i * f_i
  def a_i(self, i): return self.tabla[i][0][1] - self.tabla[i][0][0] # ancho de rango o amplitud de la clase
  def N(self): return self.F(len(self.tabla) - 1) # total de datos
  def x_me(self): return sum(self.x_i(i) * self.f_i(i) for i in range(len(self.tabla))) / self.N() # media aritmetica    
  def G(self): return math.pow(10, sum(self.f_log_x_i(i) for i in range(len(self.tabla))) / self.N()) # media geometrica
  def Mo(self): return self.tabla[self.tabla.index(max(self.tabla, key=lambda x: x[1]))][0][0] + (( self.f_i(self.tabla.index(max(self.tabla, key=lambda x: x[1]))) - self.f_i(self.tabla.index(max(self.tabla, key=lambda x: x[1])) - 1) ) / ( (self.f_i(self.tabla.index(max(self.tabla, key=lambda x: x[1]))) - self.f_i(self.tabla.index(max(self.tabla, key=lambda x: x[1])) - 1)) + (self.f_i(self.tabla.index(max(self.tabla, key=lambda x: x[1]))) - self.f_i(self.tabla.index(max(self.tabla, key=lambda x: x[1])) + 1)) )) * self.a_i(self.tabla.index(max(self.tabla, key=lambda x: x[1])))
  # moda ^
  def QDP(self, n, k): return self.tabla[self.tabla.index(max(self.tabla, key=lambda x: x[1]))][0][0] + (( k * self.N() / n - self.F(self.tabla.index(max(self.tabla, key=lambda x: x[1])) - 1) ) / ( self.F(self.tabla.index(max(self.tabla, key=lambda x: x[1]))) - self.F(self.tabla.index(max(self.tabla, key=lambda x: x[1])) - 1) )) * self.a_i(self.tabla.index(max(self.tabla, key=lambda x: x[1])))
  # k-esimo cuartil, decil o porcentil ^
  def Me(self): return self.QDP(4, 2) # mediana (segundo cuartil)
  # varianza ↓
  def V(self): return sum(self.x_i_f_i(i) for i in range(len(self.tabla))) / self.N() - math.pow(self.x_me(), 2) # varianza





# Pruebas

datos = datos_agrupados([
  [ [ 10, 15 ], 5 ],
  [ [ 15, 20 ], 9 ],
  [ [ 20, 25 ], 12 ],
  [ [ 25, 30 ], 15 ],
  [ [ 30, 35 ], 11 ],
  [ [ 35, 40 ], 8 ]
])

for i in range(len(datos.tabla)): print(f"{datos.clase(i)[0]} - {datos.clase(i)[1]} : {datos.f_i(i)} ({datos.F(i)}/{datos.N()})")
print(f"Media aritmética: {datos.x_me()}")
print(f"Media geométrica: {datos.G()}")
print(f"Mediana: {datos.Me()}")
print(f"Moda: {datos.Mo()}")
print(f"Varianza: {datos.V()}")