const conf = {
	day: {
		from: 7,
		to: 20
	}
}

setInterval(()=>{
	console.clear()
	new Date().getHours()<conf.day.from|| (new Date().getHours()>=16&&new Date().getMinutes()>=27) ? console.log("night"): console.log("day")
},1000)