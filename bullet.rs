fn calculate_drag(rho: f32, drag_area: f32, velocity: f32, drag_coeff: f32) -> f32 {
    return (rho * drag_area * velocity.powf(2.0) * drag_coeff) / 2.0;
}

fn calculate_x_acc(drag: f32, angle_rad: f32, mass: f32) -> f32 {
    return -drag * angle_rad.cos() / mass;
}

fn calculate_y_acc(drag: f32, angle_rad: f32, mass: f32) -> f32 {
    let g: f32 = 9.8;                           // gravity acceleration [m/s]
    return -g -drag * angle_rad.sin() / mass;
}

fn propagate_bullet_trajectory(max_steps: i32) {
    // Model parameters
    const MASS: f32 = 0.02;                                         // MASS of projectile [kg]
    const VELOCITY: f32 = 300.0;                                    // initial velocity [m/s]
    const ANGLE: f32 = 9.0;                                         // angle of initial velocity [deg]
    const ANGLE_RAD: f32 = ANGLE * std::f32::consts::PI / 180.0;    // angle of initial velocity [rad]
    const DRAG_COEFF: f32 = 0.295;                                  // drag coefficient of the bullet
    const RHO: f32 = 1.225;                                         // air density at sea level [kg/m^3]
    const R: f32 = 0.005;                                           // radius of bullet [m]
    const DRAG_AREA: f32 = std::f32::consts::PI * R * R;            // drag area of the bullet [m^2]
    const DT: f32 = 0.2;                                            // time step [s]
    const WIND_SPEED: f32 = 10.0;                                   // head wind speed [m/s]

    let mut t = vec![0.0; 1];
    let mut vx = vec![VELOCITY * ANGLE_RAD.cos(); 1];
    let mut vy = vec![VELOCITY * ANGLE_RAD.sin(); 1];

    let mut drag: f32 = calculate_drag(RHO, DRAG_AREA, VELOCITY + WIND_SPEED, DRAG_COEFF);  // drag force
    let mut ax = vec![calculate_x_acc(drag, ANGLE_RAD, MASS); 1];                           // acceleration due to drag [m/s]
    let mut ay = vec![calculate_y_acc(drag, ANGLE_RAD, MASS); 1];                           // acceleration due to drag [m/s]

    let mut x = vec![0.0; 1];
    let mut y = vec![0.0; 1];

    for ii in 0.. max_steps {
        let i = ii as usize;
        if (y[i] + DT * vy[i]) <= 0.0 {
            break;
        }
        
        t.push(t[i] + DT);
        x.push(x[i] + DT * vx[i]);
        y.push(y[i] + DT * vy[i]);
        vx.push(vx[i] + DT * ax[i]);
        vy.push(vy[i] + DT * ay[i]);
        
        let velocity_magnitude = (vx[i].powf(2.0) + vy[i].powf(2.0)).sqrt() + WIND_SPEED;
        
        drag = calculate_drag(RHO, DRAG_AREA, velocity_magnitude, DRAG_COEFF);
        ax.push(calculate_x_acc(drag, ANGLE_RAD, MASS));
        ay.push(calculate_y_acc(drag, ANGLE_RAD, MASS));

        println!("{} {}", x[i], y[i]);
    }

}

fn main() {
    propagate_bullet_trajectory(1000);
}