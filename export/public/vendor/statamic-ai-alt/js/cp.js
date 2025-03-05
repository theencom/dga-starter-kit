Statamic.$hooks.on('asset.saved', (asset) => {
    // Refresh the asset browser after alt text generation
    Statamic.$containers.assets.refresh();
});
