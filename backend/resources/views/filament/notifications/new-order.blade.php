<div x-data="{
    init() {
        window.Echo.channel('orders')
            .listen('.new-order', (data) => {
                // Bunyi notifikasi
                const audio = new Audio('/sounds/notification.mp3')
                audio.play()

                // Tampilkan notifikasi
                $dispatch('new-order-received', data)
            })
    }
}" @new-order-received.window="
        $notification = event.detail
    "></div>
