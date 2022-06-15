//import {Simulation_universe} from "./simulation_universe.js"

//---------------------------------COSMOLOGICAL CONSTANT--------------------------------------------------------------//

//Creation of the universe simulation that will be used for the whole website
let universe = new Simulation_universe("universe");

//this simulation will only be used to compute the scale factor
let universe_1 = new Simulation_universe("matter_universe", 0, 32, 1, false, false, true);

//this boolean allow us to know the type of simulation
let dark_E=false;
let mono=false;


function update_universe_results() {
    document.getElementById("resultat_omegak0").innerHTML = universe.calcul_omega_k().toExponential(4);
    document.getElementById("resultat_omegar0").innerHTML = universe.calcul_omega_r().toExponential(4);
    /*if (mono){
        document.getElementById("resultat_omegak0").innerHTML = universe.calcul_omega_k();
        document.getElementById("resultat_omegar0").innerHTML = universe.calcul_omega_r();
    }
    */
}

    
//Computes the age of the universe in seconds and in Ga
function calcul_time(){
    let age = Number(universe.universe_age());
    document.getElementById("resultat_ageunivers_s").innerHTML = age.toExponential(4);
    document.getElementById("resultat_ageunivers_ga").innerHTML = (universe.seconds_to_years(age)/Math.pow(10,9)).toExponential(4);
}


function update_universe_parameters() {
    mono=false;
    update_universe_rayonment();
    update_flat();
    universe.temperature = Number(document.getElementById("T0").value);
    universe.hubble_cst = Number(document.getElementById("H0").value);
    universe.matter_parameter = Number(document.getElementById("omegam0").value);

    //If the universe is flat, the dark energy density parameter is determined by the other omegas
    // (since omegak=0). Otherwise, it is given by the user.
    if (universe.is_flat){
        document.getElementById("omegalambda0").value = universe._dark_energy.parameter_value.toExponential(4);
    }
    else{
        universe.dark_energy.parameter_value = Number(document.getElementById("omegalambda0").value);
    }
    update_universe_results();
    
}

//If we use a dark energy simulation, w_1 and w_0 can be modified. Otherwise, the default values (w_0=-1 and w1=0)
//are used
function dark_energy(){
    universe.dark_energy.w_0 = Number(document.getElementById("omega0").value);
    universe.dark_energy.w_1 = Number(document.getElementById("omega1").value);
    dark_E=true;
}


//we use a different function if we use a monofluid model.
function update_universe_mono(){
    //The type of model is chosen by the user in a list (see website)
    mono=true;
    let model = document.getElementById("type_valeurs").value;
    if (model==1){
        universe.single_fluid("matter");
    }
    if (model==2){
        universe.single_fluid("radiation");
    }
    if (model==3){
        universe.single_fluid("cosmo_cst");
    }
    if (model==4){
        universe.single_fluid("curvature");
    }
    universe.hubble_cst=document.getElementById("H0").value;
    document.getElementById("resultat_omegar0").innerHTML= universe.calcul_omega_r();
    document.getElementById("omegak").innerHTML= universe.calcul_omega_k();
    document.getElementById("resultat_omegalambda0").innerHTML= universe.dark_energy.parameter_value;
    document.getElementById("resultat_omegam0").innerHTML= universe.matter_parameter;
    document.getElementById("temperature").innerHTML= universe.temperature.toExponential(4);
}


//This fonction creates the graph of the scale factor a in function of the time t
function trace_scale_factor() {
    //We start by updating the parameters
    if (mono){
             update_universe_mono();
         }
    else{
        update_universe_parameters();
    }
    //The user can chose the minimal and maximal values of a
    let amin = document.getElementById("ami").value;
    let amax = document.getElementById("ama").value;

    let result_a_tau = universe.compute_scale_factor(0.0001, [amin, amax]);
    universe_1.compute_scale_factor(0.01);
    let trace_1 = {
        x: result_a_tau.x,
        y: result_a_tau.y,
        mode: 'lines'
    };
    graph = $("#graphic_scale_factor");
    Plotly.purge(graph);
    graph.empty();
    wid = graph.width();
    //We adjust the graph size depending the screen size
    if (window.innerWidth > 1700) {
        hei = wid * 0.5;
    } else {
        hei = wid * 2 / 3;
    }
    //"o_recupereJson" is a method from "gestion_langues.js". It allows us to get 
    //the text we need in different languages
    var texte = o_recupereJson();
    //We adjust the legend of the graph depending the type of simulation
    let input_text='<b>' + texte.calculs_univers.entrees + '</b><br>' + 'T<sub>0</sub>= '+
    universe.temperature+ ' K<br>' + 'H<sub>0</sub>= '
     + universe.hubble_cst +' km.s<sup>-1</sup>.Mpc<sup>-1</sup><br>' 
     + 'Ω<sub>m0</sub>= ' + universe.matter_parameter +
    '<br>Ω<sub>Λ0</sub>= ' + universe.dark_energy.parameter_value;
    let output_text="<b>" + texte.calculs_univers.sorties + "<\/b><br>Ω<sub>r0<\/sub>= " +
    universe.calcul_omega_r().toExponential(4) + "<br>Ω<sub>k0</sub>= " 
    + universe.calcul_omega_k().toExponential(4) + "<br>t<sub>BB</sub>= " +
    (universe.seconds_to_years(universe.universe_age())*Math.pow(10,-9)).toExponential(4) + " Ga";
    if (mono){
        input_text= '<b>' + texte.calculs_univers.entrees + '</b><br>'+
        'Ω<sub>m0</sub>= ' + universe.matter_parameter + ' ; Ω<sub>Λ0</sub>= ' + universe.dark_energy.parameter_value
        +'<br>Ω<sub>r0</sub>='  + universe.calcul_omega_r()+ " ; Ω<sub>k0</sub>= " + universe.calcul_omega_k()
        + '<br>H<sub>0</sub>= '+ universe.hubble_cst +' km.s<sup>-1</sup>.Mpc<sup>-1</sup>' ;

        output_text='<b>' + texte.calculs_univers.entrees + '</b><br>' + 'T<sub>0</sub>= '+
        universe.temperature.toExponential(4) + ' K<br>' + "t<sub>BB</sub>= " +
        (universe.seconds_to_years(universe.universe_age())*Math.pow(10,-9)).toExponential(4) + " Ga";
    }
    if (dark_E==true){
        input_text+='<br>' + 'w<sub>0</sub>=' + universe.dark_energy.w_0
                    + " ; w<sub>1</sub>=" + universe.dark_energy.w_1;
    }
    annots = [{
                x: 0.005,
                xref: 'paper',
                xanchor: 'center',
                y: 1.025,
                yref: 'paper',
                yanchor: 'bottom',
                text: input_text,
                showarrow: false,
            },
            {
                "xref": "paper",
                "yref": "paper",
                "text":output_text,
                "y": 1.,
                "x": 1,
                xanchor: 'center',
                yanchor: 'bottom',
                "showarrow": false
            }

        ];

    document.getElementById("graphic_scale_factor").style.height = hei + "px";
    let graphic = document.getElementById("graphic_scale_factor");
    Plotly.newPlot(graphic, [trace_1],
    {   
        title:texte.calculs_univers.titre,

        xaxis: {
            autorange: true,
            title: 't (Ga)',
            showline: true
        },
        
        yaxis: {
            rangemode: 'tozero',
            autorange: true,
            title: 'a(t)',
            showline: true
        },

        annotations: annots,
    });
}

//We update the type of rayonment chosen by the user in the list (see website)
function update_universe_rayonment() {
    let param_ray = document.getElementById("liste").value;
    if (param_ray === "Matière, Lambda, RFC et Neutrinos") {
        universe.has_cmb = true;
        universe.has_neutrino = true;
    }
    else if (param_ray === "Matière, Lambda et RFC") {
        universe.has_cmb = true;
        universe.has_neutrino = false;
    }
    else {
        universe.has_cmb = false;
        universe.has_neutrino = false;

    }

}


function update_flat() {
    if (document.getElementById("flat_univ").checked) {
        universe.is_flat = true;
        document.getElementById("txt_univplat").value = true;

    }
    else {
        universe.is_flat = false;
        document.getElementById("txt_univplat").value = false;

    }
}

//Opens the Adjunct computation window for the Cosmological constant part
function open_window_adjunct(){
    storage();
    window.open("Calculs.html", "childWindow", DimFen1500x900Res);
    //document.getElementById("txt_univplat").innerHTML = true;

}

function open_window_adjunct_single_fluids(){
    storage_mono();
    window.open("Calculs_monofluides.html", "childWindow", DimFen1500x900Res);
    //document.getElementById("txt_univplat").innerHTML = true;

}




//-------------------------------------------ADJUNCT COMPUTATION for the Cosmological constant-----------------------

function calc_rho(){
    document.getElementById("rhom").innerHTML =universe.calcul_rho_m().toExponential(8);
    document.getElementById("rhor").innerHTML =universe.calcul_rho_r().toExponential(8);
    document.getElementById("rholambda").innerHTML = universe.calcul_rho_lambda().toExponential(8);
}

function update_adjunct(){
   update_universe_parameters();
   calc_rho();


}

//Computes the calculus linked to the cosmological shifts
function calc_shift(){
    
    if (!mono){
    update_adjunct();
    }
    
    let z1 = Number(document.getElementById("z1").value);
    let z2 = Number(document.getElementById("z2").value);
    if (mono){
    let dm1 = universe.metric_distance(z1);
    document.getElementById("dm1").innerHTML = 5; }
    let dm2 = universe.metric_distance(z2); 
    let dm = universe.delta_dm(z1,z2);

 
    //Cosmological parameters at z1 and z2    
    document.getElementById("Tz1").innerHTML = universe.T(z1).toExponential(4);
    document.getElementById("Hz1").innerHTML = universe.H(z1).toExponential(4);
    document.getElementById("Omz1").innerHTML = universe.omega_m_shift(z1).toExponential(4);
    document.getElementById("Olz1").innerHTML = universe.omega_DE_shift(z1).toExponential(4);
    document.getElementById("Orz1").innerHTML = universe.omega_r_shift(z1).toExponential(4);
    document.getElementById("Okz1").innerHTML = universe.omega_k_shift(z1).toExponential(4);
    document.getElementById("Tz2").innerHTML = universe.T(z2).toExponential(4);
    document.getElementById("Hz2").innerHTML = universe.H(z2).toExponential(4);
    document.getElementById("Omz2").innerHTML = universe.omega_m_shift(z2).toExponential(4);
    document.getElementById("Olz2").innerHTML = universe.omega_DE_shift(z2).toExponential(4);
    document.getElementById("Orz2").innerHTML = universe.omega_r_shift(z2).toExponential(4);
    document.getElementById("Okz2").innerHTML = universe.omega_k_shift(z2).toExponential(4);

    //Geometry
    //document.getElementById("dm1").innerHTML = dm1.toExponential(4);
    document.getElementById("dm1_pc").innerHTML = universe.meter_to_parsec(dm1).toExponential(4);
    document.getElementById("dm1_ly").innerHTML = universe.meter_to_light_year(dm1).toExponential(4);
    document.getElementById("dm2").innerHTML = dm2.toExponential(4);
    document.getElementById("dm2_pc").innerHTML = universe.meter_to_parsec(dm2).toExponential(4);
    document.getElementById("dm2_ly").innerHTML = universe.meter_to_light_year(dm2).toExponential(4);
    document.getElementById("dm").innerHTML = dm.toExponential(4);
    document.getElementById("dm_pc").innerHTML = universe.meter_to_parsec(dm).toExponential(4);
    document.getElementById("dm_ly").innerHTML = universe.meter_to_light_year(dm).toExponential(4);
    document.getElementById("tempsEmission").innerHTML = 
                                        universe.seconds_to_years(universe.emission_age(z1)).toExponential(4);
    document.getElementById("tempsEmission_sec").innerHTML =universe.emission_age(z1).toExponential(4);
    document.getElementById("tempsReception").innerHTML = 
                                universe.seconds_to_years(universe.emission_age(z2)).toExponential(4);
    document.getElementById("tempsReception_sec").innerHTML = universe.emission_age(z2).toExponential(4);
    document.getElementById("agebetween_sec").innerHTML = universe.duration(z1,z2).toExponential(4);
    document.getElementById("agebetween").innerHTML =universe.seconds_to_years(universe.duration(z1,z2)).toExponential(4);

}

function calcultheta(){
    let D = document.getElementById("diameter").value;
    let z;
    //the user can chose the value of z that will be used
    if (document.getElementById("z1_checkbox").checked){
        z = Number(document.getElementById("z1").value);
    }
    if (document.getElementById("z2_checkbox").checked){
        z = Number(document.getElementById("z2").value);
    }
    let dm = universe.metric_distance(z);
    document.getElementById("theta").value = universe.theta(D,z,dm).toEx;
}

function calculthetakpc(){
    let D = document.getElementById("diameterkpc").value;
    let z;
    //the user can chose the value of z that will be used
    if (document.getElementById("z1_checkbox").checked){
        z = Number(document.getElementById("z1").value);
    }
    if (document.getElementById("z2_checkbox").checked){
        z = Number(document.getElementById("z2").value);
    }
    let dm = universe.metric_distance(z);
    document.getElementById("theta").value = universe.theta_kpc(D,z,dm).toExponential(2);
}

function calculD(){
    let theta = Number(document.getElementById("theta").value);
    let z;
    //the user can chose the value of z that will be used
    if (document.getElementById("z1_checkbox").checked){
        z = Number(document.getElementById("z1").value);
    }
    if (document.getElementById("z2_checkbox").checked){
        z = Number(document.getElementById("z2").value);
    }
    let dm = Number(universe.metric_distance(z));
    let D = universe.D(theta,z,dm);
    document.getElementById("diameter").value = D.m.toExponential(2);
    document.getElementById("diameterkpc").value = D.kpc.toExponential(2);



}

//This function stores the values we will reuse for the adjunct calculations
function storage(){
    sessionStorage.setItem("T0", universe.temperature);
    sessionStorage.setItem("H0", universe.hubble_cst);
    sessionStorage.setItem("omegam0", universe.matter_parameter);
    sessionStorage.setItem("omegalambda0", universe.dark_energy.parameter_value);

}

function storage_mono(){
    let model;
    sessionStorage.setItem("H0",universe.hubble_cst);
    if (universe.is_single_matter){
        model="matter";
    }
    if (universe.is_single_cosmo){
        model="cosmo_cst";
    }
    if (universe.is_single_curvature){
        model="curvature";
    }    
    if (universe.is_single_radiation){
        model="radiation";
    }
    sessionStorage.setItem("modele", model);
}

function transfer_param(){
    mono=false;
    document.getElementById("T0").value = sessionStorage.getItem("T0");
    document.getElementById("H0").value = sessionStorage.getItem("H0");
    document.getElementById("omegam0").value = sessionStorage.getItem("omegam0");
    document.getElementById("omegalambda0").value = sessionStorage.getItem("omegalambda0");
    universe.temperature = Number(document.getElementById("T0").value);
    universe.hubble_cst = Number(document.getElementById("H0").value);
    universe.matter_parameter = Number(document.getElementById("omegam0").value);
    universe.dark_energy.parameter_value = Number(document.getElementById("omegalambda0").value);
    update_universe_results();
    calc_rho();
}


function transfer_param_mono(){
    mono=true;
    let modele=sessionStorage.getItem("modele");
    universe.hubble_cst = sessionStorage.getItem("H0");
    universe.single_fluid(modele);
    document.getElementById("omegam0").innerHTML = universe.matter_parameter;
    document.getElementById("omegalambda0").innerHTML = universe.dark_energy.parameter_value;
    
    document.getElementById("resultat_omegak0").innerHTML = universe.calcul_omega_k();
    document.getElementById("resultat_omegar0").innerHTML = universe.calcul_omega_r();

    document.getElementById("T0").innerHTML =universe.temperature;
    //We round off the result only if T0 isn't zero
    if (universe.temperature !==0 ){
        document.getElementById("T0").innerHTML =universe.temperature.toExponential(4);
    }
    document.getElementById("H0").innerHTML =universe.hubble_cst;
    calc_rho();


}



function reverse_calculations(){
    let dm=document.getElementById("dm_racine_dm").value;
    document.getElementById("z_racine_dm").innerHTML = universe.reverse_shift_dm(dm);

}

function photometry(){
    let z1= Number(document.getElementById("z1").value);
    let dm1 = Number(universe.metric_distance(z1));
    let z2= Number(document.getElementById("z2").value);
    let dm2 = Number(universe.metric_distance(z2));
    let I = Number(document.getElementById("i_e").value);

    document.getElementById("L_e").innerHTML = universe.luminosity(I).toExponential(4);
    document.getElementById("dl").innerHTML = universe.luminosity_distance(z1,dm1).meter.toExponential(4);
    document.getElementById("dl_pc").innerHTML = universe.luminosity_distance(z1,dm1).pc.toExponential(4);
    document.getElementById("dl_ly").innerHTML = universe.luminosity_distance(z1,dm1).ly.toExponential(4);
    document.getElementById("dl2").innerHTML = universe.luminosity_distance(z2,dm2).meter.toExponential(4);
    document.getElementById("dl2_pc").innerHTML = universe.luminosity_distance(z2,dm2).pc.toExponential(4);
    document.getElementById("dl2_ly").innerHTML = universe.luminosity_distance(z2,dm2).ly.toExponential(4);
    document.getElementById("dda").innerHTML = universe.apparent_diameter(z1,dm1).meter.toExponential(4);
    document.getElementById("dda_pc").innerHTML = universe.apparent_diameter(z1,dm1).pc.toExponential(4);
    document.getElementById("dda_ly").innerHTML = universe.apparent_diameter(z1,dm1).ly.toExponential(4);
    document.getElementById("E_e").innerHTML = universe.brightness(z1,universe.luminosity(I),dm1).toExponential(4);
    document.getElementById("E_e_2").innerHTML = universe.brightness(z2,universe.luminosity(I),dm2).toExponential(4);



}

