// cannister code goes here
import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

type patient = record<{
    id: string;
    name: string;
    age: nat64;
    createdTime: nat64;
    updatedTime:opt<natb4>;
}>
type appointment = record<{
    id: string;
    dept: string;
    physician_name: string;
    time: nat64;
    createdTime: nat64;
    updatedTime: nat64;
}>
type cashout = record<{
    id: string;
    name: string;
    sercive_id: string;
    payout: string;
    createdTime: nat64;
    updatedTime: nat64;
}>
type appointmentPayload = record<{
    dept: string;
    physician_name: string;
}>
type cashoutPayload = record<{
    name: string;
    payout: string;
}>
//creating instances for stableBTreeMaps
const patientStorage = new StableBTreeMap<string, patient>(0, 42, 500);
const appointmentStorage = new StableBTreeMap<string, appointment>(1, 42, 500);
const cashoutStorage = new StableBTreeMap<string, cashout>(2, 42, 500);

//initializing patientstorage
$update;
export function patient(name: string): string{
    if(!patientStorage.isEmpty()){
        return 'patient record is up to date'
    }
    const patient = {
        id: uuidv4(), 
        name: name;
        createdAt: ic.time(), 
        updatedAt: Opt.None, 
    };
    patientStorage.insert(patient.id, patient);
  return patient.id;
}
$query;
export function getappointmenttime(id: string): Result<appointment, string> {
    const time = appointmentStorage.values().filter((time) => !time.isOccupied);
    if (time.length == 0){
        return Result.Err("no physicians available at the time")
    }
    return Result.Ok(time);
}
$update;
export function addappointment(payload: appointmentPayload):  string{
    if (patientstorage.isEmpty()){
        patient("In session")
    }
}
$update;
export function updateappointment(id: string, payload: appointmentPayload): Result<appointment, string> {
    return match(appointmentStorage.get(id), {
        Some: (appointment) => {
            const updatedAppointment: appointment = {...appointment, ...payload, updatedAt: Opt.Some(ic.time())};
            appointmentStorage.insert(appointment.id, updatedAppointment);
            return Result.Ok<appointment, string>(updatedAppointment);
        },
        None: () => Result.Err<appointment, string>(`couldn't update a patient appointment with id=${id}.appointment not found`)
    });
}
$update;
export function deleteappointment(id: string): Result<appointment, string> {
    return match(appointmentStorage.remove(id), {
        Some: (deletedAppointment) => Result.Ok<appointment, string>(deletedAppointment),
        None: () => Result.Err<appointment, string>(`couldn't delete a patient appointment with id=${id}. appointment not found.`)
    });
}
$update
export function pricing(payload: cashoutPayload): string{
    const price = payment(payload.appointment_serviceid).price;
    const cashout = {
        id: uuidv4();
        name: string;
        created_date: ic.time(),
        updated_at: Opt.None,
    };
    cashoutStorage.insert(cashout.id, cashout);
    return ` new total cost: \$${price + 5}`;
  }
//crypto for object testing
globalThis.crypto = {
    // @ts-ignore
   getRandomValues: () => {
       let array = new Uint8Array(32)

       for (let i = 0; i < array.length; i++) {
           array[i] = Math.floor(Math.random() * 256)
       }

       return array
   }
}