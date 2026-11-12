import { fetchAdminPlans, saveCustomPlan, publishPlan, archivePlan, deletePlan } from "./db";

const getPlans = async (status = "all") => {
    try {
        const allPlans = await fetchAdminPlans();
        let filtered = allPlans;
        if (status && status !== "all") {
            filtered = allPlans.filter((p) => p.status === status);
        }
        return { success: true, plans: filtered };
    } catch (err) {
        console.error("Error in getPlans from services:", err);
        throw err;
    }
};

const createPlan = async (planData) => {
    try {
        const saved = await saveCustomPlan(planData);
        return { success: true, plan: saved };
    } catch (err) {
        console.error("Error in createPlan:", err);
        throw err;
    }
};

const updatePlan = async (id, planData) => {
    try {
        const updated = await saveCustomPlan(planData, id);
        return { success: true, plan: updated };
    } catch (err) {
        console.error("Error in updatePlan:", err);
        throw err;
    }
};

const togglePlanStatus = async (id, status) => {
    try {
        if (status === "archived") {
            await archivePlan(id);
        } else {
            await publishPlan(id);
        }
        return { success: true, status };
    } catch (err) {
        console.error("Error in togglePlanStatus:", err);
        throw err;
    }
};

export { getPlans, createPlan, updatePlan, togglePlanStatus, archivePlan, deletePlan };
export default { getPlans, createPlan, updatePlan, togglePlanStatus, archivePlan, deletePlan };
