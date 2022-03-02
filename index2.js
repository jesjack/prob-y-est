/**
 * Tabla de frecuencias,
 *  ejemplo de fila: [ [rango de datos], frecuencia absoluta, frecuencia acumulada]
 */
let tabla = [
  [ [ 10, 15 ], 5 ],
  [ [ 15, 20 ], 9 ],
  [ [ 20, 25 ], 12 ],
  [ [ 25, 30 ], 15 ],
  [ [ 30, 35 ], 11 ],
  [ [ 35, 40 ], 8 ],
]

let frecuencia = 0
tabla.forEach((fila, index) => {
  frecuencia += fila[1]
  tabla[index][2] = frecuencia // acumulada
})

tabla['clase'] = (fila) => tabla[fila][0] // rango de datos
tabla['x_i'] = (fila) => (tabla[fila][0][0] + tabla[fila][0][1]) / 2 // punto medio o marca de clase
tabla['log(x_i)'] = (fila) => Math.log10(tabla['x_i'](fila)) // logaritmo de x_i
tabla['f*log(x_i)'] = (fila) => tabla['f_i'](fila) * tabla['log(x_i)'](fila) // f_i * log(x_i)
tabla['f_i'] = (fila) => tabla[fila][1] // frecuencia absoluta
tabla['F'] = (fila) => tabla[fila][2] // frecuencia acumulada
tabla['x_i * f_i'] = (fila) => tabla['x_i'](fila) * tabla['f_i'](fila) // x_i * f_i
tabla['a_i'] = (fila) => tabla[fila][0][1] - tabla[fila][0][0] // ancho de rango o amplitud

for (let i in tabla) if (isNaN(i)) for (let j in tabla) if (!isNaN(j)) tabla[j][i] = () => tabla[i](j)

tabla['N'] = tabla.reduce((a, f) => a + f[1], 0) // total de datos
tabla['x^-'] = tabla.map((_, i) => tabla['x_i * f_i'](i)).reduce((a, b) => a + b) / tabla['N'] // media aritmética
tabla['G'] = Math.pow(10, tabla.map((_, i) => tabla['f*log(x_i)'](i)).reduce((a, b) => a + b) / tabla['N']) // media geométrica

tabla['Mo'] = () => { // moda
  let i = tabla.findIndex((fila) => fila['f_i']() === Math.max(...tabla.map((_, i) => tabla['f_i'](i))))
  return tabla[i][0][0] + (( tabla['f_i'](i) - tabla['f_i'](i - 1) ) / ( (tabla['f_i'](i) - tabla['f_i'](i - 1)) + (tabla['f_i'](i) - tabla['f_i'](i + 1)) )) * tabla['a_i'](i)
} // moda

tabla['QDP'] = (n, k) => { // k-esimo cuartil, decil o porcentil
  let i = tabla.findIndex((fila, i) => fila['F'](i+1) >= k * tabla['N'] / n)
  return QDPk = tabla[i][0][0] + tabla['a_i'](i) * ((k * tabla['N'] / n - tabla['F'](i-1))/(tabla['F'](i)-tabla['F'](i-1)))
} // k-esimo cuartil, decil o porcentil

tabla['Me'] = tabla['QDP'](4, 2) // mediana




tabla.map((fila) => {
  console.log(
    `${fila[0][0]} - ${fila[0][1]} : ${fila[1]} (${fila[2]}/${tabla['N']})`
  )
})

console.log(`Media aritmética: ${tabla['x^-']}`)
console.log(`Media geométrica: ${tabla['G']}`)
console.log(`Mediana: ${tabla['Me']}`)
console.log(`Moda: ${tabla['Mo']()}`)