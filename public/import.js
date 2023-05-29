async function importData(fileName){
    const response = await fetch(fileName);
    const text = await response.text();

    const p_data = [];
    const t_data = []; 
    const n_data = [];

    // console.log(text);

    const data = [[],[],[]];

    const parse = text.split("\n");
    for(let i = 0; i < parse.length; i++) {

        if(i == 8) console.log(parse[i].split(/[ ,]+/));
        readLine(parse[i].split(/[ ,]+/));
    };

    // console.log(p_data);

    return [p_data, t_data, n_data];

//parse[i] = parse[i].split(/\s+|\//g)

    function readLine(str){
        // [f 1/2/3 1/3/4 3/2/4]
        switch(str[0]){
            case("v"):   
                for(let i = 0; i < 3; i++) {
                    data[0].push(parseFloat(str[i+1]));
                }
                break;
            case("vt"):
                for(let i = 0; i < 2; i++) {
                    data[1].push(parseFloat(str[i+1]));
                }
                break;
            case("vn"):
                for(let i = 0; i < 3; i++) {
                    data[2].push(parseFloat(str[i+1]));
                }
                break;
            case("f"):
                // console.log(str);

                for(let i = 0; i < 3; i++) {
                    str[i+1] = str[i+1].split("/");
                    
                    for(let j = 0; j < 3; j++) p_data.push(data[0][(str[i+1][0]-1)*3+j])
                    if(str[i+1].length > 1 && str[i+1][1] != " ") {
                        for(let j = 0; j < 2; j++) t_data.push(data[1][(str[i+1][1]-1)*2+j]);
                    }
                    if(str[i+1].length == 3) {
                        for(let j = 0; j < 3; j++) n_data.push(data[2][(str[i+1][2]-1)*3+j]);
                    }
                    
                }
        }
    }


}