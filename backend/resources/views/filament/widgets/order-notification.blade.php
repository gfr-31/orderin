<div x-data="{
    lastOrderId: {{ \App\Models\Order::latest()->first()?->id ?? 0 }},

    init() {
        setInterval(() => {
            fetch('/api/v1/admin/latest-order', {
                    headers: {
                        'Accept': 'application/json',
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.id && data.id > this.lastOrderId) {
                        this.lastOrderId = data.id;

                        // Bunyi notifikasi
                        const audio = new Audio('/sounds/notification.mp3');
                        audio.play().catch(e => {});

                        // Toast notification
                        new FilamentNotification()
                            .title('Order Baru Masuk! 🔔')
                            .body(data.customer + ' - ' + data.order_number)
                            .success()
                            .duration(8000)
                            .send();
                    }
                })
                .catch(e => {});
        }, 10000); // cek tiap 10 detik
    }
}" x-init="init()"></div>
