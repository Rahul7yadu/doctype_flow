import frappe

@frappe.whitelist()
def get_doctypes_for_module(module_name):
    doctypes = frappe.get_all("DocType", filters={"module": module_name}, fields=["name", "module", "istable"], order_by="name asc")

    result = []
    for dt in doctypes:
        try:
            meta = frappe.get_meta(dt.name)
            fields_data = []
            for df in meta.fields:
                if df.fieldtype in ["Link", "Dynamic Link", "Table", "Table MultiSelect", "Data", "Select", "Int", "Float", "Currency", "Check", "Date", "Datetime"]:
                    fields_data.append({
                        "fieldname": df.fieldname,
                        "fieldtype": df.fieldtype,
                        "label": df.label,
                        "options": df.options,
                        "reqd": df.reqd
                    })
                    
            result.append({
                "name": dt.name,
                "module": dt.module,
                "istable": dt.istable,
                "fields": fields_data
            })
        except Exception as e:
            continue

    return result

@frappe.whitelist()
def get_modules_for_app(app_name):
    modules = frappe.get_all("Module Def", filters={"app_name": app_name}, pluck="name", order_by="name asc")
    return modules

@frappe.whitelist()
def get_installed_apps():
    return frappe.get_installed_apps()
