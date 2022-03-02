let tabla_frecuencias ={
  '60 - 62': 7,
  '63 - 65': 20,
  '66 - 68': 44,
  '69 - 71': 29,
  '72 - 74': 10,

  // '1': 11,
  // '2': 3,
  // '3': 5,
  // '4': 5,
}

/** @type { string[] }*/
let datos = [
  // '5', '5', '7', '9', '11', '12', '15', '18'
  // '2', '2', '5', '7', '9', '9', '9', '10', '10', '11', '12', '18',
  // '8', '3', '5', '12', '10'
  // '2', '8', '4'
]

// Si los datos están vacíos rellenar con la tabla de frecuencias
if (datos.length === 0)
  Object.entries(tabla_frecuencias).forEach(([key, value]) => { for (let i = 0; i < value; i++) datos.push(key) })

// Si la tabla de frecuencias está vacía rellenar con los datos
if (Object.keys(tabla_frecuencias).length === 0)
  Object.entries(datos).forEach(([key, value]) => {
    if (tabla_frecuencias[value]) tabla_frecuencias[value]++
    else tabla_frecuencias[value] = 1 })

let tabla_frecuencias_acumuladas = {} // las frecuencias se van sumando
let suma = 0
Object.entries(tabla_frecuencias).forEach(([key, value]) => {
  suma += value
  tabla_frecuencias_acumuladas[key] = suma
})


suma = 0

// Sumar todos los valores del objeto
for (let i in tabla_frecuencias)
  suma += tabla_frecuencias[i]

let frecuencia_relativa = {}

// Calculo de la frecuencia relativa
Object.entries(tabla_frecuencias).forEach(([key, value]) => frecuencia_relativa[key] = value / suma)

let punto_medio = {}

// Calculo del punto medio de cada rango si es que la información está dividida en rangos, si no, se arregla el valor
Object.entries(frecuencia_relativa).forEach(([key, value]) => punto_medio[key] = (parseInt(key.split(' - ')[0]) + parseInt(key.split(' - ')[1])) / 2)
Object.entries(punto_medio).forEach(([key, value]) => punto_medio[key] = isNaN(value) ? parseInt(key) : value)
let marca_de_clase = punto_medio

let límites = {}

// Calculo de los límites de cada rango
Object.entries(frecuencia_relativa).forEach(([key, value]) =>
  límites[key] = {
    'límite inferior': parseInt(key.split(' - ')[0]),
    'límite superior': parseInt(key.split(' - ')[1])
  })

let media_aritmética = 0

// Calculo de la media aritmética si los datos no están agrupados
if (datos[0].split(' - ').length === 1) {
  for (let i of datos) media_aritmética += parseInt(i)
  media_aritmética /= datos.length
}

let media_geométrica = 1

// Calculo de la media geométrica si los datos no están agrupados
if (datos[0].split(' - ').length === 1) {
  for (let i of datos) {
    media_geométrica *= parseInt(i)
    // console.log(i)
  }
  media_geométrica = Math.pow(media_geométrica, 1 / datos.length)
}

let pesos = datos.map((value, index) => { return 1 })
let promedio_ponderado = 0

// Calculo del promedio ponderado
for (let i = 0; i < datos.length; i++)
promedio_ponderado += parseInt(datos[i]) * pesos[i]
promedio_ponderado /= pesos.reduce((a, b) => a + b)

let mediana = 0

// Calculo de la mediana
if (datos[0].split(' - ').length === 1) {
  datos.sort((a, b) => a - b)
  mediana = datos.length % 2 === 0 ? (parseInt(datos[datos.length / 2]) + parseInt(datos[datos.length / 2 - 1])) / 2 : parseInt(datos[Math.floor(datos.length / 2)])
} else { // dato[n] = 'a - b'
  datos.sort((a, b) => a.split(' - ')[0] - b.split(' - ')[0])
  let clase_mediana = datos[Math.floor(datos.length / 2)]

  let frontera_inferior_de_la_clase_mediana = Object.entries(tabla_frecuencias).map(([key, value], index) => {
    if (key === clase_mediana) return (parseInt(clase_mediana.split(' - ')[0]) + parseInt(Object.entries(tabla_frecuencias)[index - 1][0].split(' - ')[1])) / 2
  }).filter(value => value !== undefined)[0]
  let frontera_superior_de_la_clase_mediana = Object.entries(tabla_frecuencias).map(([key, value], index) => {
    if (key === clase_mediana) return (parseInt(clase_mediana.split(' - ')[1]) + parseInt(Object.entries(tabla_frecuencias)[index + 1][0].split(' - ')[0])) / 2
  }).filter(value => value !== undefined)[0]

  let numero_de_datos = datos.length

  let suma_de_las_frecuencias_de_las_clases_inferiores_a_la_de_la_mediana = Object.entries(tabla_frecuencias).map(([key, value]) => {
    if (key.split(' - ')[1] < frontera_inferior_de_la_clase_mediana) return value
    else return 0
  }).reduce((a, b) => a + b)

  let frecuencia_de_la_clase_mediana = tabla_frecuencias[clase_mediana]
  let anchura_del_intervalo_de_la_clase_mediana = frontera_superior_de_la_clase_mediana - frontera_inferior_de_la_clase_mediana

  mediana = (
    frontera_inferior_de_la_clase_mediana + (
      ((numero_de_datos / 2) - suma_de_las_frecuencias_de_las_clases_inferiores_a_la_de_la_mediana)
      / frecuencia_de_la_clase_mediana
    ) * anchura_del_intervalo_de_la_clase_mediana
  )
}

let moda


// Calculo de la moda
if (datos[0].split(' - ').length === 1) {
  let moda_aux = {}
  for (let i in datos) {
    if (moda_aux[datos[i]]) moda_aux[datos[i]]++
    else moda_aux[datos[i]] = 1
  }
  moda = Object.entries(moda_aux).sort((a, b) => b[1] - a[1])[0][0]
} else {
  // clase_modal = la clase que tiene la mayor frecuencia
  let clase_modal = Object.entries(tabla_frecuencias).sort((a, b) => b[1] - a[1])[0][0]
  let frontera_inferior_de_la_clase_modal = Object.entries(tabla_frecuencias).map(([key, value], index) => {
    if (key === clase_modal) return (parseInt(clase_modal.split(' - ')[0]) + parseInt(Object.entries(tabla_frecuencias)[index - 1][0].split(' - ')[1])) / 2
  }).filter(value => value !== undefined)[0]
  let frontera_superior_de_la_clase_modal = Object.entries(tabla_frecuencias).map(([key, value], index) => {
    if (key === clase_modal) return (parseInt(clase_modal.split(' - ')[1]) + parseInt(Object.entries(tabla_frecuencias)[index + 1][0].split(' - ')[0])) / 2
  }).filter(value => value !== undefined)[0]

  let exceso_de_la_frecuencia_modal_sobre_la_clase_inferior_inmediata = Object.entries(tabla_frecuencias).map(([key, value], index) => {
    if (key === clase_modal) return value - Object.entries(tabla_frecuencias)[index - 1][1]
  }).filter(value => value !== undefined)[0]
  let exceso_de_la_frecuencia_modal_sobre_la_clase_superior_inmediata = Object.entries(tabla_frecuencias).map(([key, value], index) => {
    if (key === clase_modal) return value - Object.entries(tabla_frecuencias)[index + 1][1]
  }).filter(value => value !== undefined)[0]
  
  let anchura_del_intervalo_de_la_clase_modal = frontera_superior_de_la_clase_modal - frontera_inferior_de_la_clase_modal

  moda = (
    frontera_inferior_de_la_clase_modal + (
      exceso_de_la_frecuencia_modal_sobre_la_clase_inferior_inmediata / (
        exceso_de_la_frecuencia_modal_sobre_la_clase_inferior_inmediata + exceso_de_la_frecuencia_modal_sobre_la_clase_superior_inmediata
      ) * anchura_del_intervalo_de_la_clase_modal
    )
  )
}

console.log(
  'tabla de frecuencias:', tabla_frecuencias, '\n',
  'tabla de frecuencias acumuladas', tabla_frecuencias_acumuladas, '\n',
  'media aritmetica:', media_aritmética + '\n',
  'media geometrica:', media_geométrica + '\n',
  'mediana:', mediana + '\n',
  'moda:', moda, '\n'
)