"use client"
import { Button } from "@/components/ui/button"
import { defineStepper } from "@stepperize/react"
import { ArrowBigLeft } from "lucide-react"
import Link from "next/link"

const { Scoped, useStepper, steps } = defineStepper(
  { id: "step-1", title: "Step 1", description: "First step" },
  { id: "step-2", title: "Step 2", description: "Second step" },
  { id: "step-3", title: "Step 3", description: "Third step" }
)

export default function CreatedPrompt() {
  const methods = useStepper()

  return (
    <>
      <Button size="lg" variant="outline" asChild>
        <Link href='/'><ArrowBigLeft /></Link>
      </Button>

      <p>{steps[0].title}</p>
      {methods.when("step-1", (step) => (
        <p>First step: {step.title}</p>
      ))}

      {methods.when("step-2", (step) => (
        <p>Second step: {step.title}</p>
      ))}

      {methods.when("step-3", (step) => (
        <p>Second step: {step.title}</p>
      ))}

      {
        methods.isLast === false ? (
          <>
            <Button onClick={() => methods.next()}>Next</Button>
            <Button onClick={() => methods.prev()}>Previous</Button>
          </>
        ) : null
      }
    </>
  )
}


// <!DOCTYPE html>
// <html lang="es">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Formulario de Prompt Engineering</title>
//   <script src="https://cdn.tailwindcss.com"></script>
// </head>
// <body class="bg-gray-100 p-8">
//   <div class="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
//     <h1 class="text-2xl font-bold mb-6 text-center">Generador de Prompts con Recomendaciones</h1>
//     <form id="promptForm" class="space-y-6">
//       <!-- Paso 1: Objetivo -->
//       <div>
//         <label class="block text-lg font-medium text-gray-700 mb-1">1. ¿Cuál es el objetivo o tarea principal que quieres que el modelo realice?</label>
//         <textarea id="objective" name="objective" rows="3" required class="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Describe la acción o resultado deseado..."></textarea>
//         <div class="mt-4 space-y-2 ml-4">
//           <span class="text-gray-600">O selecciona un ejemplo de objetivo:</span>
//           <label class="block"><input type="radio" name="objectiveExample" value="Resume el siguiente texto explicando solo los puntos clave sin agregar opiniones personales." class="form-radio"> <span class="ml-2">📝 Resumen objetivo: Resume un texto sin agregar opiniones, manteniendo claridad.</span></label>
//           <label class="block"><input type="radio" name="objectiveExample" value="Clasifica reseñas en positivas, negativas o neutrales y explica brevemente por qué." class="form-radio"> <span class="ml-2">🔍 Clasificación de sentimiento: Categoriza y justifica reseñas de usuarios.</span></label>
//           <label class="block"><input type="radio" name="objectiveExample" value="Genera una función en Python documentada y con prueba unitaria que invierta una cadena." class="form-radio"> <span class="ml-2">💻 Código con test: Crear función funcional y bien documentada.</span></label>
//           <label class="block"><input type="radio" name="objectiveExample" value="Crea una tabla con los principales indicadores de rendimiento de marketing y sus metas." class="form-radio"> <span class="ml-2">📊 Tabla de KPIs: Representar KPIs con claridad en formato tabular.</span></label>
//           <label class="block"><input type="radio" name="objectiveExample" value="Otros" id="objectiveOtherRadio" class="form-radio"> <span class="ml-2">✏️ Otros</span></label>
//           <textarea id="objectiveOtherInput" name="objectiveOther" rows="2" placeholder="Especifica otro objetivo..." class="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 hidden"></textarea>
//         </div>
//       </div>
//       <!-- Paso 2: Ejemplos de entrada/salida -->
//       <div>
//         <label class="block text-lg font-medium text-gray-700 mb-1">2. Selecciona un ejemplo de entrada y salida deseada:</label>
//         <div class="space-y-4 ml-4">
//           <label class="block"><input type="radio" name="examples" value="Entrada: 'Resume el siguiente texto sobre cambio climático manteniendo viñetas y sin opiniones personales.' Salida: '- Aumento de temperatura global\n- Derretimiento de glaciares\n- Impacto en ecosistemas'" required class="form-radio"> <span class="ml-2">Ejemplo 1: Resumen con formato y restricción de opinión</span></label>
//           <label class="block"><input type="radio" name="examples" value="Entrada: 'Clasifica las siguientes reseñas en positivo, negativo o neutral y explica tu elección.' Salida: 'Positivo: La calidad es excelente porque...'" class="form-radio"> <span class="ml-2">Ejemplo 2: Clasificación de sentimiento con justificación</span></label>
//           <label class="block"><input type="radio" name="examples" value="Entrada: 'Escribe una función en Python invert_string(cadena) que invierta la cadena y documenta con docstring y test.' Salida: 'def invert_string(cadena):\n    """Invierte la cadena proporcionada"""\n    return cadena[::-1]\n# Prueba: assert invert_string('hola') == 'aloh'" class="form-radio"> <span class="ml-2">Ejemplo 3: Generación de código con docstring y prueba</span></label>
//           <label class="block"><input type="radio" name="examples" value="Entrada: 'Crea una tabla de indicadores de rendimiento (KPI) para un proyecto de marketing.' Salida: 'Tabla KPI | Descripción | Meta'" class="form-radio"> <span class="ml-2">Ejemplo 4: Estructura tabular de KPIs</span></label>
//           <label class="block"><input type="radio" name="examples" value="Otros" id="examplesOtherRadio" class="form-radio"> <span class="ml-2">✏️ Otros</span></label>
//           <textarea id="examplesOtherInput" name="examplesOther" rows="3" placeholder="Escribe tu propio ejemplo detallado..." class="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 hidden"></textarea>
//         </div>
//       </div>
//       <!-- Paso 3: Formato de salida -->
//       <div>
//         <label class="block text-lg font-medium text-gray-700 mb-1">3. ¿En qué formato deseas recibir la respuesta?</label>
//         <div class="space-y-2 ml-4">
//           <label class="inline-flex items-center"><input type="radio" name="format" value="JSON" required class="form-radio"> <span class="ml-2">🗂️ JSON</span></label>
//           <label class="inline-flex items-center"><input type="radio" name="format" value="Lista" class="form-radio"> <span class="ml-2">📋 Lista</span></label>
//           <label class="inline-flex items-center"><input type="radio" name="format" value="Párrafo" class="form-radio"> <span class="ml-2">📄 Párrafo</span></label>
//           <label class="inline-flex items-center"><input type="radio" name="format" value="Código" class="form-radio"> <span class="ml-2">💻 Fragmento de código</span></label>
//         </div>
//       </div>
//       <!-- Paso 4: Estilo/Tono -->
//       <div>
//         <label class="block text-lg font-medium text-gray-700 mb-1">4. ¿Qué estilo, tono o rol debe adoptar el modelo al generar la respuesta?</label>
//         <div class="space-y-2 ml-4">
//           <label class="inline-flex items-center"><input type="radio" name="style" value="Formal" required class="form-radio"> <span class="ml-2">🎩 Formal</span></label>
//           <label class="inline-flex items-center"><input type="radio" name="style" value="Humorístico" class="form-radio"> <span class="ml-2">😂 Humorístico</span></label>
//           <label class="inline-flex items-center"><input type="radio" name="style" value="Técnico experto" class="form-radio"> <span class="ml-2">💻 Técnico experto</span></label>
//           <label class="inline-flex items-center"><input type="radio" name="style" value="Resumido" class="form-radio"> <span class="ml-2">📝 Resumido</span></label>
//           <label class="inline-flex items-center"><input type="radio" name="style" value="Detallado" class="form-radio"> <span class="ml-2">🔍 Detallado</span></label>
//           <label class="inline-flex items-center"><input type="radio" name="style" value="Otros" id="styleOtherRadio" class="form-radio"> <span class="ml-2">✏️ Otros</span></label>
//           <input type="text" id="styleOtherInput" name="styleOther" placeholder="Especifica otro estilo..." class="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 hidden">
//         </div>
//       </div>
//       <!-- Paso 5: Configuraciones -->
//       <div>
//         <label class="block text-lg font-medium text-gray-700 mb-1">5. ¿Qué configuraciones o restricciones adicionales quieres aplicar?</label>
//         <div class="space-y-4 ml-4">
//           <label class="block"><input type="radio" name="settings" value="Tokens máximo: 100, Temperatura: 0.7" required class="form-radio"> <span class="ml-2 font-medium">Tokens máximo: 100, Temperatura: 0.7</span></label>
//           <p class="ml-8 text-sm text-gray-500">Conciso y creativo moderado.</p>
//           <label class="block"><input type="radio" name="settings" value="Tokens máximo: 200, Temperatura: 0.3" class="form-radio"> <span class="ml-2 font-medium">Tokens máximo: 200, Temperatura: 0.3</span></label>
//           <p class="ml-8 text-sm text-gray-500">Más largo y preciso, menos creativo.</p>
//           <label class="block"><input type="radio" name="settings" value="Tokens máximo: 50, Temperatura: 1.0" class="form-radio"> <span class="ml-2 font-medium">Tokens máximo: 50, Temperatura: 1.0</span></label>
//           <p class="ml-8 text-sm text-gray-500">Muy creativo, posible incoherencia.</p>
//           <label class="block"><input type="radio" name="settings" value="Otros" id="settingsOtherRadio" class="form-radio"> <span class="ml-2">✏️ Otros</span></label>
//           <textarea id="settingsOtherInput" name="settingsOther" rows="2" placeholder="Especifica otras configuraciones..." class="mt-2 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 hidden"></textarea>
//           <!-- Sliders para tokens y temperatura -->
//           <div class="mt-4 ml-4">
//             <label for="tokenRange" class="block text-sm font-medium text-gray-700">Número máximo de tokens: <span id="tokenValue" class="font-semibold">100</span></label>
//             <input type="range" id="tokenRange" name="tokenRange" min="10" max="500" step="10" value="100" class="w-full">
//           </div>
//           <div class="mt-4 ml-4">
//             <label for="tempRange" class="block text-sm font-medium text-gray-700">Temperatura: <span id="tempValue" class="font-semibold">0.7</span></label>
//             <input type="range" id="tempRange" name="tempRange" min="0" max="1" step="0.01" value="0.7" class="w-full">
//           </div>
//         </div>
//       </div>
//       <!-- Botón de envío -->
//       <div class="text-center">
//         <button type="submit" class="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-2xl shadow hover:bg-indigo-600 transition">Generar Prompt</button>
//       </div>
//     </form>
//     <!-- Área de resultado -->
//     <div id="result" class="mt-8 p-4 bg-gray-50 rounded-xl hidden">
//       <h2 class="text-xl font-bold mb-3">Prompt Generado</h2>
//       <pre id="generatedPrompt" class="whitespace-pre-wrap text-sm text-gray-800"></pre>
//     </div>
//   </div>
// </body>
// </html>
