AFRAME.registerComponent('dish-rotation', 
    {
        init: function () 
        {
            const dish = this.el;       // <a-entity id="Dish">
            let dragging = false;
            let lastX = 0;

    /* Mouse */
    window.addEventListener('mousedown', e => 
        {
            dragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });

    window.addEventListener('mouseup', () => dragging = false);

    window.addEventListener('mousemove', e =>
        {
            if (!dragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;

            if (e.buttons === 1) 
            {
                dish.object3D.rotation.y += dx * 0.01;
            } 

            else if (e.buttons === 2) 
            {
                dish.object3D.rotation.x += dy * 0.01;
                dish.object3D.rotation.y += dx * 0.01;
            }

            else if (e.buttons === 4) 
            {
                dish.object3D.scale.x += dy * 0.01;
                dish.object3D.scale.y += dy * 0.01;
                dish.object3D.scale.z += dy * 0.01;
            }
            
        });

        window.addEventListener('wheel', e =>
            {
                dish.object3D.scale.x += e.deltaY * -0.01;
                dish.object3D.scale.y += e.deltaY * -0.01;
                dish.object3D.scale.z += e.deltaY * -0.01;
            });

    /* Touch */
    window.addEventListener('touchstart', e => 
        {
            if (e.touches.length !== 1 && e.touches.length !== 2) return;
            dragging = true;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
            if (e.touches.length === 2)
                {
                    lastDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                }
        });

    window.addEventListener('touchend', () => dragging = false);

    window.addEventListener('touchmove', e => 
        {
            if (!dragging || e.touches.length !== 2) return;
            const x1 = e.touches[0].clientX;
            const y1 = e.touches[0].clientY;
            const x2 = e.touches[1].clientX;
            const y2 = e.touches[1].clientY;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.hypot(dx, dy);
            
            if (distance !== lastDistance)
                {
                    dish.object3D.scale.x += (distance - lastDistance) * 0.01;
                    dish.object3D.scale.y += (distance - lastDistance) * 0.01;
                    dish.object3D.scale.z += (distance - lastDistance) * 0.01;
                }

            lastDistance = distance;
            lastX = (x1 + x2) / 2;
            lastY = (y1 + y2) / 2;
            dish.object3D.rotation.x += (dy / distance) * 0.01;
            dish.object3D.rotation.y += (dx / distance) * 0.01;

        });
    }
     


});
