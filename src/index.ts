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
    const message: Message = {
        id: uuidv4(), 
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
export function updateMessage(id: string, payload: MessagePayload): Result<Message, string> {
    return match(messageStorage.get(id), {
        Some: (message) => {
            const updatedMessage: Message = {...message, ...payload, updatedAt: Opt.Some(ic.time())};
            messageStorage.insert(message.id, updatedMessage);
            return Result.Ok<Message, string>(updatedMessage);
        },
        None: () => Result.Err<Message, string>(`couldn't update a message with id=${id}. message not found`)
    });
}
$update;
export function deleteMessage(id: string): Result<Message, string> {
    return match(messageStorage.remove(id), {
        Some: (deletedMessage) => Result.Ok<Message, string>(deletedMessage),
        None: () => Result.Err<Message, string>(`couldn't delete a message with id=${id}. message not found.`)
    });
}// a workaround to make uuid package work with Azle
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