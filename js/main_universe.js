//import {Simulation_universe} from "./simulation_universe.js"

//---------------------------------COSMOLOGICAL CONSTANT--------------------------------------------------------------//

let universe = new Simulation_universe("universe");
let universe_1 = new Simulation_universe("matter_universe", 0, 32, 1, false, false, true);




function update_universe_results() {
    document.getElementById("resultat_omegak0").innerHTML = universe.calcul_omega_k().toExponential(4);
    document.getElementById("resultat_omegar0").innerHTML = universe.calcul_omega_r().toExponential(4);
}

    

function calcul_time(){
    let age = Number(universe.universe_age());
    document.getElementById("resultat_ageunivers_s").innerHTML = age.toExponential(4);
    document.getElementById("resultat_ageunivers_ga").innerHTML = (universe.seconds_to_years(age)/Math.pow(10,9)).toExponential(4);
}


function update_universe_parameters() {
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

function dark_energy(){
    universe.dark_energy.w_0 = Number(document.getElementById("omega0").value);
    universe.dark_energy.w_1 = Number(document.getElementById("omega1").value);
}



function update_universe_mono(){
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


}



function trace_scale_factor() {
    if (universe.is_single_cosmo || universe.is_single_curvature ||
         universe.is_single_matter || universe.is_single_radiation){
             update_universe_mono();
         }
    else{
        update_universe_parameters();
    }
    let result_a_tau = universe.compute_scale_factor(0.0001, [0.01, 10]);
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
    if (window.innerWidth > 1700) {
        hei = wid * 0.5;
    } else {
        hei = wid * 2 / 3;
    }
document.getElementById("graphic_scale_factor").style.height = hei + "px";
    let graphic = document.getElementById("graphic_scale_factor");
    Plotly.newPlot(graphic, [trace_1], { margin: { t: 0 } });
}

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
    window.open("Calculs.html", "childWindow", DimFen1500x900Res);
    document.getElementById("txt_univplat").innerHTML = true;

}




//-------------------------------------------ADJUNCT COMPUTATION for the Cosmological constant-----------------------

function update_adjunct(){
   // document.getElementById("resultat_omegak0").innerHTML =document.getElementById("liste").value;
   update_universe_parameters();
   document.getElementById("rhom").innerHTML =universe.calcul_rho_m().toExponential(8);
   document.getElementById("rhor").innerHTML =universe.calcul_rho_r().toExponential(8);
   document.getElementById("rholambda").innerHTML = universe.calcul_rho_lambda().toExponential(8);
   document.getElementById("dm1").innerHTML = 2;



}

function calc_shift(){
    update_adjunct();
    let z1 = Number(document.getElementById("z1").value);
    let z2 = Number(document.getElementById("z2").value);
 
//Cosmological parameters at z1 and z2    
    document.getElementById("Tz1").innerHTML = universe.T(z1).toExponential(4);
    document.getElementById("Hz1").innerHTML = universe.H(z1).toExponential(4);
    document.getElementById("Omz1").innerHTML = universe.omega_m_shift(z1).toExponential(4);
    document.getElementById("Olz1").innerHTML = universe.omega_DE_shift(z1).toExponential(4);
    document.getElementById("Orz1").innerHTML = universe.omega_r_shift(z1).toExponential(4);
    document.getElementById("Okz1").innerHTML = universe.omega_k_shift(z1).toExponential(4);
    document.getElementById("agebetween").innerHTML = universe.omega_k_shift(z1).toExponential(4);
    document.getElementById("Tz2").innerHTML = universe.T(z2).toExponential(4);
    document.getElementById("Hz2").innerHTML = universe.H(z2).toExponential(4);
    document.getElementById("Omz2").innerHTML = universe.omega_m_shift(z2).toExponential(4);
    document.getElementById("Olz2").innerHTML = universe.omega_DE_shift(z2).toExponential(4);
    document.getElementById("Orz2").innerHTML = universe.omega_r_shift(z2).toExponential(4);
    document.getElementById("Okz2").innerHTML = universe.omega_k_shift(z2).toExponential(4);
    document.getElementById("L_e").innerHTML = 7; //universe.omega_k_shift(z2).toExponential(4);

//Photometry:


}

function calcultheta(){
    document.getElementById("theta").innerHTML=8;
}

function reverse_calculations(){
    let dm=document.getElementById("dm_racine_dm").value;
    document.getElementById("z_racine_dm").innerHTML = universe.reverse_shift_dm(dm);

}

console.log("test")


