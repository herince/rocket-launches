struct Planet {
    r: f32,     // [m]
    mass: f32   // [kg]
}

fn gravity(planet: Planet, z: f32) -> f32 {
    let g = 6.6742 * f32::powf(10.0, -11.0);
    let r = (z.powf(2.0) + 0.0).sqrt();
    let mut accel = 0.0;

    if r >= planet.r {
        accel = g * planet.mass / r.powf(3.0) * r;
    }

    println!("{}", accel);

    return accel;
}

fn derivative(z: f32, vel: f32) -> (f32, f32) {
    let earth = Planet {
        r: 6371000.0,
        mass: 5.972 * f32::powf(10.0, 24.0)
    };
    let rocket_mass = 2000.0 / 1000.0; // [kg]

    // compute zdot - kinematic relationship
    let zdot = vel;
    
    // compute the total forces
    
    // -> gravity
    let gravity_f = -gravity(earth, z) * rocket_mass;
    
    // -> aerodynamics
    let aero = 0.0;
    
    // -> thrust
    let thrust = 0.0;
    
    let forces = gravity_f + aero + thrust;
    
    // compute the acceleration
    let zddot = forces / rocket_mass;
    let statedot = (zdot, zddot);
    
    return statedot;
}

fn main() {
}