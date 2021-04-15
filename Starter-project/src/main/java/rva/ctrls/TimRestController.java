package rva.ctrls;

import java.util.Collection;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rva.jpa.Nacionalnost;
import rva.jpa.Tim;
import rva.repository.TimRepository;

@CrossOrigin
@RestController
public class TimRestController {
	
	@Autowired
	private TimRepository timRepository;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@GetMapping("tim")
	public Collection<Tim> getTimovi(){
		return timRepository.findAll();
	}
	
	@GetMapping("tim/{id}")
	public Tim getTim(@PathVariable ("id") Integer id) {
		return timRepository.getOne(id);
	}
	
	@GetMapping("timNaziv/{naziv}")
	public Collection<Tim> getTimByNaziv(@PathVariable("naziv") String naziv) {
		return timRepository.findByNazivContainingIgnoreCase(naziv);
	}
	
	@PostMapping("tim")
	public ResponseEntity<Tim> insertTim(@RequestBody Tim tim){
		if(!timRepository.existsById(tim.getId())) {
			timRepository.save(tim);
			return new ResponseEntity<Tim>(HttpStatus.OK);
		}
		return new ResponseEntity<Tim>(HttpStatus.CONFLICT);
	}
	
	@PutMapping("tim")
	public ResponseEntity<Tim> updateTim(@RequestBody Tim tim){
		if(!timRepository.existsById(tim.getId()))
			return new ResponseEntity<Tim>(HttpStatus.NO_CONTENT);
		timRepository.save(tim);
		return new ResponseEntity<Tim>(HttpStatus.OK);
	}
	
	//@Transactional
	@DeleteMapping("tim/{id}")
	public ResponseEntity<Tim> deleteTim(@PathVariable ("id") Integer id){
		if(!timRepository.existsById(id))
			return new ResponseEntity<Tim>(HttpStatus.NO_CONTENT);
		
		jdbcTemplate.execute("DELETE FROM igrac WHERE tim=" + id);
		
		timRepository.deleteById(id);
		
		if( id == -100)
			jdbcTemplate.execute("INSERT INTO \"tim\" (\"id\", \"naziv\", \"osnovan\", \"sediste\", \"liga\") "
					+ "VALUES (-100, 'TestTim', to_date('13.02.1933.', 'dd.mm.yyyy.'), 'TestSediste', 1)");
			return new ResponseEntity<Tim>(HttpStatus.OK);
	}

}
