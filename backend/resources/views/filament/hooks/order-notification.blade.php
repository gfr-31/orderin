<div x-data="{
    lastOrderId: 0,
    init() {
        fetch('/api/v1/admin/latest-order')
            .then(r => r.json())
            .then(d => { if (d.id) this.lastOrderId = d.id; });

        setInterval(() => {
            fetch('/api/v1/admin/latest-order')
                .then(r => r.json())
                .then(data => {
                    if (data.id && data.id > this.lastOrderId) {
                        this.lastOrderId = data.id;

                        const audio = new Audio('/sounds/notification.mp3');
                        audio.play().catch(e => {});

                        new FilamentNotification()
                            .title('Order Baru Masuk! 🔔')
                            .body(data.customer + ' - ' + data.order_number)
                            .success()
                            .duration(8000)
                            .send();
                    }
                })
                .catch(e => {});
        }, 10000);
    }
}" x-init="init()"></div>
