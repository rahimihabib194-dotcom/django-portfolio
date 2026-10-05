/* صحنه سه‌بعدی به سبک Noomo Labs:
   - عروس‌های دریایی شیشه‌ای شناور با شاخک‌های موج‌دار
   - حباب‌های بالا‌رونده + ذرات غبار + مه عمقی
   - پارالاکس دوربین با موس
   - افکت سه‌بعدی روی عکس پروفایل + هاله گندمی چشم‌ها
   اگه Three.js لود نشه (آفلاین)، فقط گرادیان CSS پشت دیده می‌شه. */
(function () {
    // ---------- ۱) افکت سه‌بعدی روی عکس پروفایل ----------
    var photo = document.getElementById("photo3d");
    if (photo) {
        var glare = photo.querySelector(".photo-glare");
        document.addEventListener("mousemove", function (e) {
            var r = photo.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width - 0.5;
            var py = (e.clientY - r.top) / r.height - 0.5;
            photo.style.transform =
                "rotateY(" + (px * 20).toFixed(2) + "deg) rotateX(" + (-py * 20).toFixed(2) + "deg)";
            if (glare) {
                glare.style.setProperty("--gx", (px * 100 + 50).toFixed(1) + "%");
                glare.style.setProperty("--gy", (py * 100 + 50).toFixed(1) + "%");
            }
        });
        document.addEventListener("mouseleave", function () {
            photo.style.transform = "rotateY(0deg) rotateX(0deg)";
        });
    }

    // ---------- ۲) افکت گندمی روی چشم‌ها ----------
    var eyezone = document.getElementById("eyezone");
    if (eyezone) {
        eyezone.addEventListener("mouseenter", function () { eyezone.classList.add("active"); });
        eyezone.addEventListener("mouseleave", function () { eyezone.classList.remove("active"); });
        eyezone.addEventListener("touchstart", function () { eyezone.classList.add("active"); });
        eyezone.addEventListener("touchend", function () {
            setTimeout(function () { eyezone.classList.remove("active"); }, 1200);
        });
    }

    // ---------- ۳) صحنه Three.js ----------
    var canvas = document.getElementById("bg3d");
    if (!canvas || typeof THREE === "undefined") return;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e27, 0.038);

    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 9;

    // نورها
    scene.add(new THREE.AmbientLight(0x8899ff, 0.55));
    var l1 = new THREE.PointLight(0x38bdf8, 1.6, 50); l1.position.set(6, 5, 6); scene.add(l1);
    var l2 = new THREE.PointLight(0xc084fc, 1.3, 50); l2.position.set(-7, -2, 5); scene.add(l2);
    var l3 = new THREE.PointLight(0x22d3ee, 1.0, 50); l3.position.set(0, -6, 4); scene.add(l3);

    // متریال شیشه‌ای
    var glassBase = new THREE.MeshPhysicalMaterial({
        color: 0x9fd8ff,
        metalness: 0,
        roughness: 0.12,
        transparent: true,
        opacity: 0.38,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        side: THREE.DoubleSide
    });

    function makeJellyfish(scale, tint) {
        var g = new THREE.Group();
        var mat = glassBase.clone();
        if (tint) mat.color.set(tint);

        // کلاهک (گنبد)
        var bell = new THREE.Mesh(
            new THREE.SphereGeometry(1, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.55),
            mat
        );
        g.add(bell);

        // هسته نورانی داخل
        var coreMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.45 });
        var core = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 14), coreMat);
        core.position.y = 0.22;
        g.add(core);

        // شاخک‌ها
        var tentacles = [];
        var n = 9;
        for (var i = 0; i < n; i++) {
            var a = (i / n) * Math.PI * 2;
            var pts = [];
            var len = 1.7 + Math.random() * 1.3;
            for (var s = 0; s <= 5; s++) {
                pts.push(new THREE.Vector3(
                    Math.sin(s * 1.1 + i) * 0.14,
                    -(s / 5) * len,
                    Math.cos(s * 0.9 + i) * 0.14
                ));
            }
            var tube = new THREE.Mesh(
                new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.022, 8, false),
                mat
            );
            var holder = new THREE.Group();
            holder.position.set(Math.cos(a) * 0.72, 0.3, Math.sin(a) * 0.72);
            holder.add(tube);
            holder.userData.phase = Math.random() * Math.PI * 2;
            holder.userData.speed = 1.1 + Math.random() * 0.9;
            g.add(holder);
            tentacles.push(holder);
        }

        g.scale.setScalar(scale);
        g.userData = {
            bell: bell, core: core, tentacles: tentacles,
            phase: Math.random() * Math.PI * 2,
            baseX: 0, speed: 0.5 + Math.random() * 0.4
        };
        return g;
    }

    var jellies = [];
    [
        { s: 1.5, x: -3.6, y: 0.6, z: -2.5, tint: 0x9fd8ff },
        { s: 1.0, x: 3.8, y: -1.4, z: -3.5, tint: 0xd8b4fe },
        { s: 0.7, x: 0.8, y: 2.4, z: -4.5, tint: 0xa5f3fc }
    ].forEach(function (d) {
        var j = makeJellyfish(d.s, d.tint);
        j.position.set(d.x, d.y, d.z);
        j.userData.baseX = d.x;
        jellies.push(j);
        scene.add(j);
    });

    // حباب‌های بالا‌رونده
    var bCount = 90;
    var bGeo = new THREE.BufferGeometry();
    var bp = new Float32Array(bCount * 3);
    var bs = new Float32Array(bCount);
    for (var i = 0; i < bCount; i++) {
        bp[i * 3] = (Math.random() - 0.5) * 22;
        bp[i * 3 + 1] = (Math.random() - 0.5) * 14;
        bp[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
        bs[i] = 0.3 + Math.random() * 0.7;
    }
    bGeo.setAttribute("position", new THREE.BufferAttribute(bp, 3));
    scene.add(new THREE.Points(bGeo, new THREE.PointsMaterial({
        color: 0xbae6fd, size: 0.07, transparent: true, opacity: 0.65
    })));

    // ذرات غبار شناور
    var dCount = 260;
    var dGeo = new THREE.BufferGeometry();
    var dp = new Float32Array(dCount * 3);
    for (var k = 0; k < dCount * 3; k++) dp[k] = (Math.random() - 0.5) * 24;
    dGeo.setAttribute("position", new THREE.BufferAttribute(dp, 3));
    var dust = new THREE.Points(dGeo, new THREE.PointsMaterial({
        color: 0xa5b4fc, size: 0.05, transparent: true, opacity: 0.55
    }));
    scene.add(dust);

    // پارالاکس موس
    var mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", function (e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener("resize", function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    var clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        var dt = Math.min(clock.getDelta(), 0.05);
        var t = clock.elapsedTime;

        jellies.forEach(function (j) {
            var u = j.userData;
            // تپش کلاهک مثل شنای عروس دریایی
            var pulse = 1 + Math.sin(t * 2.2 + u.phase) * 0.07;
            u.bell.scale.set(1 / Math.sqrt(pulse), pulse, 1 / Math.sqrt(pulse));
            u.core.material.opacity = 0.32 + Math.sin(t * 2.2 + u.phase) * 0.16;
            // موج شاخک‌ها
            u.tentacles.forEach(function (h) {
                h.rotation.x = Math.sin(t * h.userData.speed + u.phase) * 0.28;
                h.rotation.z = Math.cos(t * h.userData.speed * 0.9 + u.phase) * 0.28;
            });
            // شناور شدن آرام به بالا + حرکت افقی
            j.position.y += dt * 0.35 * u.speed;
            j.position.x = u.baseX + Math.sin(t * 0.4 + u.phase) * 0.7;
            j.rotation.y = Math.sin(t * 0.25 + u.phase) * 0.4;
            if (j.position.y > 7.5) j.position.y = -7.5;
        });

        // حباب‌ها بالا می‌رن
        var arr = bGeo.attributes.position.array;
        for (var b = 0; b < bCount; b++) {
            arr[b * 3 + 1] += dt * bs[b];
            if (arr[b * 3 + 1] > 7.5) arr[b * 3 + 1] = -7.5;
        }
        bGeo.attributes.position.needsUpdate = true;
        dust.rotation.y = t * 0.02;

        // دوربین دنبال موس
        camera.position.x += (mouseX * 1.1 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 1.1 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();
})();
