// This file is required by the index.html file and will
// be executed in the renderer process for that (window as any).
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

//check how can set a select
// dont reaload page
document.getElementById('button-submit').addEventListener('click', async () => {
    const select = document.querySelector('select');
    console.log(select);
    (window as any).submit.toggle()
})

//check how works the drag and drop
//check how can save files
document.addEventListener('drop', (event) => {
	event.preventDefault();
	event.stopPropagation();

    console.log(event.dataTransfer.files);
    

	// for (const f of event.dataTransfer.files) {
	// 	// Using the path attribute to get absolute file path
	// 	console.log('File Path of dragged files: ', f.path)
	// }
});

document.addEventListener('dragover', (e) => {
	e.preventDefault();
	e.stopPropagation();
});

document.addEventListener('dragenter', (event) => {
	console.log('File is in the Drop Space');
});

document.addEventListener('dragleave', (event) => {
	console.log('File has left the Drop Space');
});

