module.exports = {
    plugins: {
        autoprefixer: {
            grid: true
        },
        'postcss-custom-properties': {
            preserve: true,
            importFrom: 'src/styles/properties.css'
        }
    }
}
