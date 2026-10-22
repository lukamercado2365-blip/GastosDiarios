# Contexto del proyecto: GastosDiarios

## Objetivo

Este repositorio corresponde a una actividad grupal de la materia Programación III. El equipo debe desarrollar una aplicación móvil de gastos diarios usando React Native y Expo.

La referencia general de la materia es [programacion3.notion.site](https://programacion3.notion.site/). Al crear este archivo, esa página no fue accesible desde las herramientas disponibles y no apareció en la búsqueda web. No se debe inventar ni asumir contenido de la materia a partir del enlace. Si una User Story necesita requisitos de esa página, pedir al usuario que comparta el texto o una captura relevante.

## Regla principal: trabajar solo en la User Story solicitada

En cada tarea, implementar **únicamente** lo pedido por la User Story indicada para ese sprint.

- Antes de cambiar código, identificar el sprint, el número de User Story y sus criterios de aceptación.
- Limitar los cambios a los archivos y comportamientos necesarios para cumplir esos criterios.
- No agregar funciones, pantallas, mejoras visuales, refactors, dependencias ni cambios de arquitectura que la historia no solicite.
- No adelantar trabajo de otras User Stories ni reinterpretar el alcance para completar el producto entero.
- Si no se indica la User Story, faltan criterios importantes o hay instrucciones contradictorias, pedir aclaración antes de implementar la parte afectada.
- Se permiten los cambios de soporte estrictamente necesarios para que la historia funcione (por ejemplo, una prueba o ajuste de configuración relacionado); explicar por qué son necesarios.
- Mantener la experiencia móvil y los patrones existentes del repositorio.

## Tecnologías e instrucciones del repositorio

- Aplicación: React Native con Expo.
- Dependencias actuales del proyecto: Expo SDK 57 y React Native 0.86.3. Consultar `ExpenseTracker/package.json` antes de tocar dependencias.
- El proyecto tiene Docker Compose para ejecutar Expo. La guía de uso está en `README.md`.
- Leer y respetar `ExpenseTracker/AGENTS.md` antes de modificar el proyecto. Sus instrucciones específicas de Expo, navegación, dependencias y validaciones complementan este archivo.
- Expo cambia entre SDKs: consultar la documentación versionada que corresponda al SDK instalado antes de usar o cambiar APIs de Expo o React Native.
- No crear ni editar manualmente las carpetas `android/` o `ios/` si no existen; seguir el flujo de Expo y sus config plugins.

## Ramas

Trabajar en una rama por User Story, sin hacer cambios directamente sobre la rama principal. Usar este formato exacto:

```text
<feat|fix>/sprint<N>-userstory<M>
```

- Usar `feat` para implementar una capacidad nueva solicitada.
- Usar `fix` para corregir un defecto existente solicitado.
- Escribir `sprint` y `userstory` en minúsculas, sin espacios; `<N>` y `<M>` son los números correspondientes.
- Ejemplo: `feat/sprint2-userstory3`.
- No inventar el sprint o número de historia. Si no se conoce, pedirlo.
- Antes de cambiar de rama, revisar `git status` y preservar el trabajo local existente. No sobrescribir, descartar ni mezclar cambios ajenos a la tarea.
- Si la rama indicada ya existe, revisarla y continuarla en vez de crear una variante con otro nombre.

## Commits

Crear commits descriptivos que indiquen qué actividad se realizó y a qué historia corresponde con una explicacion de como y porque lo hizo. Mantener cada commit limitado a los cambios de esa User Story. Ejemplo:

```text
feat(sprint2-userstory3): agregar formulario para registrar gastos en la cual se aplico ...
```

Usar `fix(...)` para una corrección. Antes de confirmar, revisar el diff y agregar al commit solo archivos de la tarea; no incluir cambios previos del usuario ni archivos sin relación. Si no se puede separar con seguridad el trabajo existente, explicar la situación en vez de incluirlo.

## Cierre y explicación para el equipo

Al terminar una User Story, informar brevemente en español:

1. Qué comportamiento se agregó o corrigió y qué criterios de aceptación cubre.
2. Qué archivos o componentes principales se modificaron.
3. Por qué se eligió esa solución y cómo funciona, explicado de forma sencilla para que el equipo pueda aprenderla y defender el proyecto.
4. Qué validaciones pertinentes se ejecutaron y su resultado, o por qué no se pudieron ejecutar.
5. El nombre de la rama y el commit creado.

Dar una explicación breve del razonamiento técnico y de las decisiones, no una transcripción extensa del proceso interno.
