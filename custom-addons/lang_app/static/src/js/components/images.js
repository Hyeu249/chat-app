/** @odoo-module */

const images = [
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
    "https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649",
    "https://i0.wp.com/picjumbo.com/wp-content/uploads/breathtaking-bali-nature-free-photo.jpg?w=600&quality=80",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWbA4sE-CIbimuWXaww9Tzbs4Mln2RV-mK8SBjNLB3GC_lrRY6jpYQowPQkZInnRezRnE&usqp=CAU",
    "https://slp-statics.astockcdn.net/static_assets/staging/24spring/home/curated-collections/card-1.jpg?width=580",
    "https://burst.shopifycdn.com/photos/clear-water-with-parked-boats-from-above.jpg?width=1000&format=pjpg&exif=0&iptc=0",
    "https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg",
    "https://www.goodfreephotos.com/cache/other-landscapes/sky-and-lake-landscape-in-auckland-new-zealand.jpg",
]

export function randomImage() {
    const randomIndex = Math.floor(Math.random() * images.length)
    return images[randomIndex]
}
