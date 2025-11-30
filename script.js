// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("Sistema cargado - Versión Final con Frase y Música");

    // --- LÓGICA DE INICIO Y AUDIO ---
    const btnIniciar = document.getElementById('btn-iniciar');
    const audioFondo = document.getElementById('audio-fondo');
    
    // Lista de reproducción
    const playlist = ['luna.mp3', 'ingle.mp3', 'reik.mp3', 'peso.mp3', 'horas.mp3'];
    
    btnIniciar.addEventListener('click', function() {
        // Reproducir el audio inicial (luna.mp3 por defecto en el HTML)
        if(audioFondo) {
            audioFondo.volume = 0.5; // Ajuste de volumen para seguridad
            audioFondo.play().catch(function(error) {
                console.log('Error al reproducir audio (click requerido):', error);
            });
        }
        
        // Iniciar la galaxia
        iniciarGalaxia();
    });

    // --- FUNCIÓN DE TRANSICIÓN Y CREACIÓN DE UI ---
    function iniciarGalaxia() {
        const paginaBienvenida = document.getElementById('pagina-bienvenida');
        const paginaGalaxia = document.getElementById('pagina-galaxia');
        
        // Transición suave
        paginaBienvenida.classList.add('ocultar');
        
        setTimeout(() => {
            paginaBienvenida.style.display = 'none';
            paginaGalaxia.style.display = 'block';
            
            // Crear el botón de música dinámicamente
            crearBotonMusica();
            
            iniciarVisualizacion();
        }, 800);
    }

    // --- FUNCIÓN PARA CREAR EL BOTÓN DE MÚSICA ---
    function crearBotonMusica() {
        const btnMusica = document.createElement('button');
        btnMusica.innerHTML = "🎵 Cambiar Música";
        btnMusica.style.position = 'fixed';
        btnMusica.style.top = '20px';
        btnMusica.style.right = '20px';
        btnMusica.style.padding = '10px 20px';
        btnMusica.style.background = 'rgba(255, 20, 147, 0.3)'; // Rosa transparente
        btnMusica.style.color = 'white';
        btnMusica.style.border = '1px solid white';
        btnMusica.style.borderRadius = '20px';
        btnMusica.style.cursor = 'pointer';
        btnMusica.style.zIndex = '1000';
        btnMusica.style.backdropFilter = 'blur(5px)';
        btnMusica.style.transition = 'all 0.3s ease';
        btnMusica.style.fontFamily = 'Arial, sans-serif';

        // Efecto Hover
        btnMusica.onmouseover = () => { 
            btnMusica.style.background = 'rgba(255, 20, 147, 0.8)'; 
            btnMusica.style.transform = 'scale(1.05)';
        };
        btnMusica.onmouseout = () => { 
            btnMusica.style.background = 'rgba(255, 20, 147, 0.3)'; 
            btnMusica.style.transform = 'scale(1)';
        };

        // Lógica al hacer click
        btnMusica.onclick = () => {
            if(audioFondo) {
                // 1. Elegir canción aleatoria distinta a la actual si es posible
                const currentSrc = audioFondo.src.split('/').pop(); // Obtener nombre archivo actual
                let newTrack;
                do {
                    const randomIndex = Math.floor(Math.random() * playlist.length);
                    newTrack = playlist[randomIndex];
                } while (newTrack === currentSrc && playlist.length > 1); // Evitar repetir la misma seguidamente

                // 2. Efecto de cambio
                audioFondo.pause();
                audioFondo.src = newTrack;
                audioFondo.load();
                audioFondo.play()
                    .then(() => console.log(`Reproduciendo: ${newTrack}`))
                    .catch(e => console.error("Error al cambiar música", e));
                
                // Feedback visual en el botón
                const originalText = btnMusica.innerHTML;
                btnMusica.innerHTML = "✨ Reproduciendo...";
                setTimeout(() => btnMusica.innerHTML = originalText, 1500);
            }
        };

        document.body.appendChild(btnMusica);
    }

    // --- LÓGICA PRINCIPAL DE THREE.JS ---
    function iniciarVisualizacion() {
        // 1. CONFIGURACIÓN BÁSICA
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Verificación de seguridad
        const container = document.getElementById('galaxy-container');
        if(container) {
            container.appendChild(renderer.domElement);
        }
        
        camera.position.set(0, 50, 250);

        const clock = new THREE.Clock();

        // 2. CONTROLES UNIVERSALES (CORREGIDO Y BLINDADO)
        // Verificamos dónde cargó la librería OrbitControls para evitar errores
        let ControlsConstructor;
        if (THREE.OrbitControls) {
            ControlsConstructor = THREE.OrbitControls;
        } else if (window.OrbitControls) {
            ControlsConstructor = window.OrbitControls;
        } else {
            console.error("Error Crítico: OrbitControls no se encontró. Revisa los CDNs.");
            return;
        }

        const controls = new ControlsConstructor(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 50;
        controls.maxDistance = 1500;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.autoRotate = false;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 1.2;
        
        // 3. CREAR LA GALAXIA DE PARTÍCULAS CON DESTELLOS
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 15000;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);
        const sizeArray = new Float32Array(particlesCount);
        
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            posArray[i3] = (Math.random() - 0.5) * 3000; 
            posArray[i3 + 1] = (Math.random() - 0.5) * 3000;
            posArray[i3 + 2] = (Math.random() - 0.5) * 3000;
            
            // Tamaños variados para efecto de profundidad
            sizeArray[i] = Math.random() * 2 + 0.5;
            
            // Colores variados
            const colorChoice = Math.random();
            if (colorChoice < 0.6) {
                colorArray[i3] = 1; colorArray[i3 + 1] = 1; colorArray[i3 + 2] = 1;
            } else if (colorChoice < 0.8) {
                colorArray[i3] = 0.8; colorArray[i3 + 1] = 0.9; colorArray[i3 + 2] = 1;
            } else {
                colorArray[i3] = 1; colorArray[i3 + 1] = 0.9; colorArray[i3 + 2] = 0.6;
            }
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
        
        const particlesMaterial = new THREE.PointsMaterial({ 
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true
        });
        const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleMesh);

        // ESTRELLAS QUE DESTELLEN
        const twinkleStarsGeometry = new THREE.BufferGeometry();
        const twinkleCount = 500;
        const twinklePos = new Float32Array(twinkleCount * 3);
        const twinklePhase = new Float32Array(twinkleCount);
        
        for (let i = 0; i < twinkleCount; i++) {
            const i3 = i * 3;
            twinklePos[i3] = (Math.random() - 0.5) * 3000;
            twinklePos[i3 + 1] = (Math.random() - 0.5) * 3000;
            twinklePos[i3 + 2] = (Math.random() - 0.5) * 3000;
            twinklePhase[i] = Math.random() * Math.PI * 2;
        }
        
        twinkleStarsGeometry.setAttribute('position', new THREE.BufferAttribute(twinklePos, 3));
        
        const twinkleMaterial = new THREE.PointsMaterial({
            size: 4,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const twinkleStars = new THREE.Points(twinkleStarsGeometry, twinkleMaterial);
        scene.add(twinkleStars);

        let moonMesh, moonGlow, textMesh;
        let phraseMeshes = [];
        let comets = [];

        // 4. CREAR LA LUNA CON TEXTURA DE CRÁTERES
        const moonGeometry = new THREE.SphereGeometry(40, 64, 64);
        
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#8A8A8A');
        gradient.addColorStop(0.5, '#B0B0B0');
        gradient.addColorStop(1, '#8A8A8A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < 150; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 30 + 5;
            
            const craterGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            craterGradient.addColorStop(0, '#4A4A4A');
            craterGradient.addColorStop(0.5, '#6A6A6A');
            craterGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = craterGradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x + radius * 0.2, y - radius * 0.2, radius * 0.9, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 50 + 20;
            ctx.fillStyle = `rgba(90, 90, 90, ${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const moonTexture = new THREE.CanvasTexture(canvas);
        const moonMaterial = new THREE.MeshBasicMaterial({ 
            map: moonTexture,
            blending: THREE.AdditiveBlending 
        });
        moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
        moonMesh.position.set(0, 0, 0);
        scene.add(moonMesh);

        const glowGeometry = new THREE.SphereGeometry(55, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xCCCCDD,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        moonGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        moonGlow.position.set(0, 0, 0);
        scene.add(moonGlow);

        // 5. CREAR COMETAS
        function createComet() {
            const cometGroup = new THREE.Group();
            
            const nucleusGeometry = new THREE.SphereGeometry(3, 16, 16);
            const nucleusMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xCCDDFF, blending: THREE.AdditiveBlending 
            });
            const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
            cometGroup.add(nucleus);
            
            const tailSegments = 25;
            for (let i = 0; i < tailSegments; i++) {
                const size = 2.8 - (i * 0.1);
                const tailGeometry = new THREE.SphereGeometry(size, 8, 8);
                const opacity = 0.7 - (i * 0.028);
                const tailMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0x99BBFF, transparent: true, opacity: opacity, blending: THREE.AdditiveBlending
                });
                const tailSegment = new THREE.Mesh(tailGeometry, tailMaterial);
                tailSegment.position.z = -i * 6;
                cometGroup.add(tailSegment);
            }
            
            const angle = Math.random() * Math.PI * 2;
            const radius = 900 + Math.random() * 600;
            cometGroup.position.x = Math.cos(angle) * radius;
            cometGroup.position.y = (Math.random() - 0.5) * 700;
            cometGroup.position.z = Math.sin(angle) * radius;
            
            const targetAngle = angle + Math.PI;
            const speed = 0.6 + Math.random() * 1.2;
            cometGroup.userData = {
                velocityX: Math.cos(targetAngle) * speed,
                velocityY: (Math.random() - 0.5) * 0.4,
                velocityZ: Math.sin(targetAngle) * speed,
                lifeTime: 0,
                maxLifeTime: 450 + Math.random() * 250
            };
            
            scene.add(cometGroup);
            return cometGroup;
        }

        for (let i = 0; i < 6; i++) {
            comets.push(createComet());
        }

        // 6. FRASES PERSONALIZADAS
        const frases = [
            "Mi cochinita preciosa, eres el amor de mi vida",
            "Fer, cada noche de llamada contigo es mi momento favorito del dia",
            "Mi corazon siempre esta contigo, mi amor",
            "Mi imillita hermosa, te llevo en mi corazon a cada segundo",
            "Ver peliculas en Netflix contigo es mejor que cualquier cine",
            "Nuestras videollamadas son el mejor momento de mis dias",
            "Eres la mujer perfecta para mi, mi Fer adorada",
            "Espero con ansias el dia en que pueda darte todos los besos que te debo",
            "Mi cochinita, eres mi sol y mi luz",
            "La distancia no es nada cuando el amor es todo, mi Fer",
            "Cada conversacion nocturna contigo me hace dormir feliz",
            "Te amo mas alla de las estrellas, mi imillita",
            "Nuestros sueños juntos son mi promesa de amor eterno",
            "El atletismo nos une, pero tu amor me hace volar",
            "Estoy impaciente por abrazarte y no soltarte nunca",
            "Mi pichulita te ama con toda su dureza, mi Fer preciosa",
            "Cada mensaje tuyo ilumina mi pantalla y mi vida",
            "Nuestro amor es infinito, mi imillita",
            "Cuando estemos juntos, te dare todas las caricias que he guardado",
            "Eres mi imillita, mi amor, mi todo",
            "Nuestros momentos picantes en llamada me vuelven loco de amor",
            "Te quiero muchisisisimo, mi cochinita adorada",
            "3 meses de amor a distancia que valen por años",
            "Mi Fer, eres la razon por la que sonrio cada noche",
            "Cada pelicula que vemos juntos es especial porque estas tu",
            "La espera vale la pena porque al final estare contigo",
            "Eres mi compañera de atletismo y de vida",
            "Tu amor hace que la distancia sea solo un detalle",
            "Mi cochinita preciosa, eres mi mayor bendicion",
            "Fer, tu risa en las llamadas es mi cancion favorita",
            "Nos contamos nuestras vidas cada noche y nunca me canso de escucharte",
            "Aunque dormidos nos dijimos te amo, mi corazon lo siente despierto",
            "Me haces sentir el hombre mas afortunado del mundo",
            "La distancia nos hace mas fuertes, mi amor",
            "Cada dia que pasa es un dia menos para estar juntos",
            "Mi imillita hermosa, eres mi inspiracion diaria",
            "Nuestras noches de conversacion son mejor que cualquier salida",
            "Te amo en la distancia, te amare mas en la cercania",
            "Nuestros corazones estan siempre juntos",
            "Mi cochinita, eres la dueña de mi corazon",
            "Cada videollamada contigo es como estar en el paraiso",
            "Fer, tu amor hace que valga la pena cada momento de espera",
            "Cuando te vea, te dare el abrazo mas largo del mundo",
            "Eres mi todo, mi cochinita preciosa",
            "El atletismo nos mantiene fuertes, tu amor me mantiene vivo",
            "Mi Fer adorada, eres mi persona favorita en todo el universo",
            "La distancia es temporal, nuestro amor es eterno",
            "Cada noche me duermo pensando en ti, mi imillita",
            "Eres mi amor, mi amiga, mi cochinita, mi vida entera",
            "3 meses de amor que se sienten como toda una vida juntos",
            "Mi corazon late mas fuerte cada vez que te veo en videollamada",
            "Fer, eres la razon por la que creo en el amor verdadero",
            "Nuestros momentos juntos, aunque virtuales, son reales en mi corazon",
            "Mi cochinita, tu amor me hace sentir completo",
            "La espera terminara y nuestros besos seran inolvidables",
            "Eres mi imillita perfecta, mi amor verdadero",
            "Cada llamada contigo es como una cita bajo las estrellas",
            "Mi Fer preciosa, te amo mas de lo que las palabras pueden expresar",
            "La distancia nos prueba, pero nuestro amor siempre gana",
            "Eres mi cochinita adorada y mi razon de ser",
            "Cuando te abrace, nunca te soltare, mi amor",
            "Nuestro amor a distancia es la prueba de que lo nuestro es real",
            "Mi imillita hermosa, cada dia te quiero mas",
            "Fer, eres mi mayor felicidad",
            "El amor no conoce distancias cuando es verdadero como el nuestro",
            "Mi cochinita preciosa, eres mi alegria infinita",
            "Cada mensaje tuyo es como un abrazo a mi alma",
            "Te amare en cualquier lugar, mi Fer adorada",
            "Eres mi compañera de vida, mi cochinita adorada",
            "3 meses es solo el comienzo de nuestra historia de amor infinita",
            "Mi Fer, tu amor me da fuerzas para seguir adelante",
            "La distancia no puede con nuestro amor, mi imillita",
            "Eres mi todo y mucho mas, mi cochinita preciosa",
            "Cada noche de llamada es una bendicion, mi amor",
            "Fer, eres la mujer de mis sueños y de mi realidad",
            "Mi corazon es tuyo, mi cochinita adorada",
            "El amor a distancia es dificil, pero contigo todo vale la pena",
            "Eres mi imillita, mi amor, mi vida entera",
            "Cada segundo que pasa es un segundo mas cerca de ti",
            "Mi Fer preciosa, te amo con toda mi alma",
            "La distancia es solo un obstaculo temporal para nuestro amor eterno",
            "Eres mi cochinita perfecta, mi amor verdadero",
            "Nuestro amor brilla mas fuerte que cualquier estrella",
            "Mi imillita adorada, eres mi mayor tesoro",
            "Fer, tu amor me hace el hombre mas feliz del mundo",
            "Cada dia que pasa te amo mas, mi cochinita preciosa",
            "La distancia no importa cuando el amor es tan grande",
            "Eres mi todo, mi mas y mi siempre, mi Fer adorada",
            "3 meses de amor puro, real y eterno",
            "Mi cochinita, eres la razon de mi felicidad",
            "El amor que siento por ti no tiene limites",
            "Eres mi imillita hermosa, mi amor infinito",
            "Cada llamada contigo es un pedacito de cielo",
            "Mi Fer preciosa, eres mi corazon latiendo",
            "La distancia nos hace valorar cada momento juntos",
            "Eres mi cochinita adorada, mi amor eterno",
            "Te amo hoy, te amare mañana, te amare siempre"
        ];
        
        const loader = new THREE.FontLoader();
        loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffb6c1, blending: THREE.AdditiveBlending 
            });
            
            // TEXTO PRINCIPAL (ARRIBA)
            const mainText = '  Mi Cochinita FER  (3 MESES)';
            const textGeometry = new THREE.TextGeometry(mainText, { 
                font: font, size: 12, height: 2 
            });
            textGeometry.center();
            textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(0, 80, 0);
            scene.add(textMesh);
            
            // --- NUEVA FRASE ESPECIAL DEBAJO DE LA LUNA ---
            // Dividimos la frase en líneas para que se lea mejor debajo
            const fraseLineas = [
                "Seamos como la luna: a veces en pedazos",
                "y otras enteras brillando mas que nunca,",
                "pero siempre amándonos en todas las fases."
            ];

            fraseLineas.forEach((linea, index) => {
                const subTextGeo = new THREE.TextGeometry(linea, {
                    font: font, size: 4.5, height: 0.2
                });
                subTextGeo.center();
                const subTextMesh = new THREE.Mesh(subTextGeo, textMaterial.clone());
                // Posicionamos debajo de la luna (y va bajando por línea)
                subTextMesh.position.set(0, -55 - (index * 8), 0);
                scene.add(subTextMesh);
            });
            
            // Emojis
            const emojiCanvas = document.createElement('canvas');
            emojiCanvas.width = 128; emojiCanvas.height = 128;
            const emojiCtx = emojiCanvas.getContext('2d');
            emojiCtx.font = 'bold 100px Arial';
            emojiCtx.textAlign = 'center';
            emojiCtx.textBaseline = 'middle';
            
            // Cerdo
            emojiCtx.clearRect(0, 0, 128, 128);
            emojiCtx.fillText('🐽', 64, 64);
            const pigTexture = new THREE.CanvasTexture(emojiCanvas);
            const pigMaterial = new THREE.SpriteMaterial({ map: pigTexture, transparent: true });
            const pigSprite = new THREE.Sprite(pigMaterial);
            pigSprite.scale.set(20, 20, 1);
            pigSprite.position.set(-80, 80, 0);
            scene.add(pigSprite);
            
            // Corazón
            emojiCtx.clearRect(0, 0, 128, 128);
            emojiCtx.fillText('❤️', 64, 64);
            const heartTexture = new THREE.CanvasTexture(emojiCanvas);
            const heartMaterial = new THREE.SpriteMaterial({ map: heartTexture, transparent: true });
            const heartSprite = new THREE.Sprite(heartMaterial);
            heartSprite.scale.set(20, 20, 1);
            heartSprite.position.set(80, 80, 0);
            scene.add(heartSprite);
            
            // Frases aleatorias (Fondo)
            frases.forEach(frase => {
                const phraseGeometry = new THREE.TextGeometry(frase, { 
                    font: font, size: 7, height: 0.5 
                });
                phraseGeometry.center();
                const phraseMesh = new THREE.Mesh(phraseGeometry, textMaterial.clone());
                const spread = 2000;
                const x = (Math.random() - 0.5) * spread;
                const y = (Math.random() - 0.5) * spread;
                const z = (Math.random() - 0.5) * spread;
                phraseMesh.position.set(x, y, z);
                phraseMeshes.push(phraseMesh);
                scene.add(phraseMesh);
            });
        });
        
        // 7. ANIMACIÓN
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;
            const delta = clock.getDelta();
            
            particleMesh.rotation.y += 0.0002;
            
            for (let i = 0; i < twinkleCount; i++) {
                const phase = time + twinklePhase[i];
                const opacity = 0.5 + Math.sin(phase * 2) * 0.5;
                twinkleMaterial.opacity = opacity;
            }
            
            moonMesh.rotation.y += 0.001;
            moonGlow.rotation.y -= 0.0008;
            const pulse = 1 + Math.sin(time * 0.5) * 0.05;
            moonGlow.scale.set(pulse, pulse, pulse);

            if (textMesh) textMesh.lookAt(camera.position);

            phraseMeshes.forEach(mesh => {
                mesh.lookAt(camera.position);
            });

            comets.forEach((comet, index) => {
                comet.position.x += comet.userData.velocityX;
                comet.position.y += comet.userData.velocityY;
                comet.position.z += comet.userData.velocityZ;
                comet.rotation.z += 0.015;
                
                comet.userData.lifeTime++;
                if (comet.userData.lifeTime > comet.userData.maxLifeTime) {
                    scene.remove(comet);
                    comets[index] = createComet();
                }
            });

            // Actualización segura de controles
            if(controls) controls.update();
            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
});