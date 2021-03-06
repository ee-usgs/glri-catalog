package gov.usgs.cida.glri.sb.ui;

/**
 * Capable of processing a parameter value into the what is sent to the ScienceBase
 * server for a query.
 * 
 * This is intended to be applied to ScienceBaseParams or similar, so they know
 * their own parameter names and types (it doesn't need to be passed).
 * 
 * @author eeverman
 */
public interface ParameterProcessor {
	
	
	/**
	 * Formats the values as the remote system expects.
	 * @param values param value array
	 * @return The formatted value or null if it cannot be processed or is empty.
	 */
	public String processParamValue(String[] values);
	
	/**
	 * Formats the value as the remote system expects.
	 * @param value param value
	 * @return The formatted value or null if it cannot be processed or is empty.
	 */
	public String processParamValue(String value);
	
	/**
	 * Formats the param name as the remote system expects.
	 * Its possible for the param value to be encoded into the name, so the
	 * value must be passed.
	 * 
	 * @param value param value
	 * @return param name
	 */
	public String processParamName(String value);
}
