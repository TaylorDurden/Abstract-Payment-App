use crate::{
    contract::{MyApp, MyAppResult},
    msg::MyAppExecuteMsg,
    state::{CONFIG, COUNT},
};

use abstract_app::traits::AbstractResponse;
use cosmwasm_std::{DepsMut, Env, MessageInfo};

pub fn execute_handler(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    module: MyApp,
    msg: MyAppExecuteMsg,
) -> MyAppResult {
    match msg {
        MyAppExecuteMsg::UpdateConfig {} => update_config(deps, env, info, module),
        MyAppExecuteMsg::Increment {} => increment(deps, module),
        MyAppExecuteMsg::Reset { count } => reset(deps, env, info, count, module),
    }
}

/// Update the configuration of the app
fn update_config(deps: DepsMut, env: Env, msg_info: MessageInfo, module: MyApp) -> MyAppResult {
    // Only the admin should be able to call this
    module
        .admin
        .assert_admin(deps.as_ref(), &env, &msg_info.sender)?;
    let mut _config = CONFIG.load(deps.storage)?;

    Ok(module.response("update_config"))
}

fn increment(deps: DepsMut, module: MyApp) -> MyAppResult {
    COUNT.update(deps.storage, |count| MyAppResult::Ok(count + 1))?;

    Ok(module.response("increment"))
}

fn reset(deps: DepsMut, env: Env, info: MessageInfo, count: i32, module: MyApp) -> MyAppResult {
    module
        .admin
        .assert_admin(deps.as_ref(), &env, &info.sender)?;
    COUNT.save(deps.storage, &count)?;

    Ok(module.response("reset"))
}
