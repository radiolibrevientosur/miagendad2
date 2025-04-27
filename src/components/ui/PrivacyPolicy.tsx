import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Política de Privacidad
        </h1>

        <div className="space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1. Información que Recopilamos
            </h2>
            <p>
              Recopilamos información que usted nos proporciona directamente al utilizar nuestra aplicación:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Información de perfil (nombre, email, fecha de nacimiento)</li>
              <li>Contenido creado (eventos, tareas, contactos)</li>
              <li>Preferencias de configuración</li>
              <li>Datos de uso de la aplicación</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2. Uso de la Información
            </h2>
            <p>
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Proporcionar y mantener el servicio</li>
              <li>Personalizar su experiencia</li>
              <li>Mejorar nuestras funcionalidades</li>
              <li>Enviar notificaciones importantes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              3. Almacenamiento de Datos
            </h2>
            <p>
              Los datos se almacenan localmente en su dispositivo y se sincronizan cuando está en línea.
              No compartimos su información con terceros sin su consentimiento explícito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              4. Sus Derechos
            </h2>
            <p>
              Usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Acceder a sus datos personales</li>
              <li>Corregir información inexacta</li>
              <li>Eliminar sus datos</li>
              <li>Exportar sus datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              5. Contacto
            </h2>
            <p>
              Si tiene preguntas sobre esta política de privacidad, puede contactarnos en:
              <br />
              <a href="mailto:douglasdonaire@gmail.com" className="text-cultural-escenicas hover:underline">
                douglasdonaire@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};